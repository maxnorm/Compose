/**
 * GitHub Models integration for documentation enhancement
 * Uses Azure AI inference endpoint with GitHub token auth
 * See: https://github.blog/changelog/2025-04-14-github-actions-token-integration-now-generally-available-in-github-models/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { models: MODELS_CONFIG } = require('./config');

// Rate limiting: GitHub Models has 10 requests per 60s limit
// We add 7 seconds between calls to stay safe (60/10 = 6, +1 buffer)
const RATE_LIMIT_DELAY_MS = 7000;
let lastApiCallTime = 0;

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for rate limit if needed
 * Ensures at least RATE_LIMIT_DELAY_MS between API calls
 */
async function waitForRateLimit() {
  const now = Date.now();
  const elapsed = now - lastApiCallTime;
  
  if (lastApiCallTime > 0 && elapsed < RATE_LIMIT_DELAY_MS) {
    const waitTime = RATE_LIMIT_DELAY_MS - elapsed;
    console.log(`    ⏳ Rate limit: waiting ${Math.ceil(waitTime / 1000)}s...`);
    await sleep(waitTime);
  }
  
  lastApiCallTime = Date.now();
}

// Load repository instructions for context
let REPO_INSTRUCTIONS = '';
try {
  const instructionsPath = path.join(__dirname, '../../copilot-instructions.md');
  REPO_INSTRUCTIONS = fs.readFileSync(instructionsPath, 'utf8');
} catch (e) {
  console.warn('Could not load copilot-instructions.md:', e.message);
}

/**
 * Make HTTPS request (promisified)
 * @param {object} options - Request options
 * @param {string} body - Request body
 * @returns {Promise<object>} Response data
 */
function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ raw: data });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (body) {
      req.write(body);
    }
    
    req.end();
  });
}

/**
 * Build the system prompt with repository context
 * @returns {string} System prompt for Copilot
 */
function buildSystemPrompt() {
  let systemPrompt = `You are a Solidity smart contract documentation expert for the Compose library. 
Always respond with valid JSON only, no markdown formatting.
Follow the project conventions and style guidelines strictly.`;

  if (REPO_INSTRUCTIONS) {
    // Extract key sections from instructions to keep context focused
    const relevantSections = [
      '## 3. Core Philosophy',
      '## 4. Facet Design Principles', 
      '## 5. Banned Solidity Features',
      '## 6. Composability Guidelines',
      '## 11. Code Style Guide',
    ];
    
    let contextSnippets = [];
    for (const section of relevantSections) {
      const startIdx = REPO_INSTRUCTIONS.indexOf(section);
      if (startIdx !== -1) {
        // Extract section content (up to next ## or 2000 chars max)
        const nextSection = REPO_INSTRUCTIONS.indexOf('\n## ', startIdx + section.length);
        const endIdx = nextSection !== -1 ? nextSection : startIdx + 2000;
        const snippet = REPO_INSTRUCTIONS.slice(startIdx, Math.min(endIdx, startIdx + 2000));
        contextSnippets.push(snippet.trim());
      }
    }
    
    if (contextSnippets.length > 0) {
      systemPrompt += `\n\n--- PROJECT GUIDELINES ---\n${contextSnippets.join('\n\n')}`;
    }
  }

  return systemPrompt;
}

/**
 * Build the prompt for Copilot based on contract type
 * @param {object} data - Parsed documentation data
 * @param {'library' | 'facet'} contractType - Type of contract
 * @returns {string} Prompt for Copilot
 */
function buildPrompt(data, contractType) {
  const functionNames = data.functions.map(f => f.name).join(', ');
  const functionDescriptions = data.functions
    .map(f => `- ${f.name}: ${f.description || 'No description'}`)
    .join('\n');

  return `Given this ${contractType} documentation from the Compose diamond proxy library, enhance it by generating:

1. **overview**: A clear, concise overview (2-3 sentences) explaining what this ${contractType} does and why it's useful in the context of diamond contracts.

2. **usageExample**: A practical Solidity code example (10-20 lines) showing how to use this ${contractType}. For libraries, show importing and calling functions. For facets, show how it would be used in a diamond.

3. **bestPractices**: 2-3 bullet points of best practices for using this ${contractType}.

${contractType === 'library' ? '4. **integrationNotes**: A note about how this library works with diamond storage pattern and how changes made through it are visible to facets.' : ''}

${contractType === 'facet' ? '4. **securityConsiderations**: Important security considerations when using this facet (access control, reentrancy, etc.).' : ''}

5. **keyFeatures**: A brief bullet list of key features.

Contract Information:
- Name: ${data.title}
- Description: ${data.description || 'No description provided'}
- Functions: ${functionNames || 'None'}
- Function Details:
${functionDescriptions || '  None'}

Respond ONLY with valid JSON in this exact format (no markdown code blocks, no extra text):
{
  "overview": "enhanced overview text here",
  "usageExample": "solidity code here (use \\n for newlines)",
  "bestPractices": "- Point 1\\n- Point 2\\n- Point 3",
  "keyFeatures": "- Feature 1\\n- Feature 2",
  ${contractType === 'library' ? '"integrationNotes": "integration notes here"' : '"securityConsiderations": "security notes here"'}
}`;
}

/**
 * Enhance documentation data using GitHub Copilot
 * @param {object} data - Parsed documentation data
 * @param {'library' | 'facet'} contractType - Type of contract
 * @param {string} token - GitHub token
 * @returns {Promise<object>} Enhanced data
 */
async function enhanceWithCopilot(data, contractType, token) {
  if (!token) {
    console.log('    ⚠️  No GitHub token provided, skipping AI enhancement');
    return addFallbackContent(data, contractType);
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildPrompt(data, contractType);

  const requestBody = JSON.stringify({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    model: MODELS_CONFIG.model,
    max_tokens: MODELS_CONFIG.maxTokens,
  });

  // GitHub Models uses Azure AI inference endpoint
  // Authentication: GITHUB_TOKEN works directly in GitHub Actions
  const options = {
    hostname: MODELS_CONFIG.host,
    port: 443,
    path: '/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Compose-DocGen/1.0',
    },
  };

  try {
    // Rate limit: wait if needed to avoid 429 errors
    await waitForRateLimit();
    console.log('    Calling GitHub Models API...');
    const response = await makeRequest(options, requestBody);

    if (response.choices && response.choices[0] && response.choices[0].message) {
      const content = response.choices[0].message.content;
      
      try {
        // Try to parse the response as JSON
        let enhanced = JSON.parse(content);
        console.log('    ✅ AI enhancement successful');
        
        // Merge enhanced content with original data
        return {
          ...data,
          overview: enhanced.overview || data.overview,
          usageExample: enhanced.usageExample || null,
          bestPractices: enhanced.bestPractices || null,
          keyFeatures: enhanced.keyFeatures || null,
          integrationNotes: enhanced.integrationNotes || null,
          securityConsiderations: enhanced.securityConsiderations || null,
        };
      } catch (parseError) {
        console.log('    ⚠️  Could not parse API response as JSON');
        console.log('    Response:', content.substring(0, 200));
        return addFallbackContent(data, contractType);
      }
    }

    console.log('    ⚠️  Unexpected API response format');
    return addFallbackContent(data, contractType);
  } catch (error) {
    console.log(`    ⚠️  GitHub Models API error: ${error.message}`);
    return addFallbackContent(data, contractType);
  }
}

/**
 * Add fallback content when Copilot is unavailable
 * @param {object} data - Documentation data
 * @param {'library' | 'facet'} contractType - Type of contract
 * @returns {object} Data with fallback content
 */
function addFallbackContent(data, contractType) {
  console.log('    Using fallback content');

  const enhanced = { ...data };

  if (contractType === 'library') {
    enhanced.integrationNotes = `This library accesses shared diamond storage, so changes made through this library are immediately visible to facets using the same storage pattern. All functions are internal as per Compose conventions.`;
    enhanced.keyFeatures = `- All functions are \`internal\` for use in custom facets\n- Follows diamond storage pattern (EIP-8042)\n- Compatible with ERC-2535 diamonds\n- No external dependencies or \`using\` directives`;
  } else {
    enhanced.keyFeatures = `- Self-contained facet with no imports or inheritance\n- Only \`external\` and \`internal\` function visibility\n- Follows Compose readability-first conventions\n- Ready for diamond integration`;
  }

  return enhanced;
}

/**
 * Check if enhancement should be skipped for a file
 * @param {object} data - Documentation data
 * @returns {boolean} True if should skip
 */
function shouldSkipEnhancement(data) {
  // Skip if no functions (likely just an interface)
  if (!data.functions || data.functions.length === 0) {
    return true;
  }
  
  // Skip if title suggests it's a simple interface
  if (data.title.startsWith('I') && data.title.length > 1 && 
      data.title[1] === data.title[1].toUpperCase()) {
    // Likely an interface like IERC165, IERC20
    return true;
  }

  return false;
}

module.exports = {
  enhanceWithCopilot,
  addFallbackContent,
  shouldSkipEnhancement,
};


