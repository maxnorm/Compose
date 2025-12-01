/**
 * GitHub Copilot integration for documentation enhancement
 * Uses GitHub Models API to generate better documentation content
 */

const https = require('https');
const { copilot: COPILOT_CONFIG } = require('./config');

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

  return `You are a Solidity documentation expert for a diamond proxy (ERC-2535) smart contract library called Compose.

Given this ${contractType} documentation, enhance it by generating:

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
    console.log('    ⚠️  No GitHub token provided, skipping Copilot enhancement');
    return addFallbackContent(data, contractType);
  }

  const prompt = buildPrompt(data, contractType);

  const requestBody = JSON.stringify({
    messages: [
      {
        role: 'system',
        content: 'You are a Solidity smart contract documentation expert. Always respond with valid JSON only, no markdown formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: COPILOT_CONFIG.model,
    max_tokens: COPILOT_CONFIG.maxTokens,
  });

  const options = {
    hostname: COPILOT_CONFIG.host,
    port: 443,
    path: '/copilot/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Compose-DocGen/1.0',
    },
  };

  try {
    console.log('Calling GitHub Copilot API...');
    const response = await makeRequest(options, requestBody);

    if (response.choices && response.choices[0] && response.choices[0].message) {
      const content = response.choices[0].message.content;
      
      try {
        // Try to parse the response as JSON
        let enhanced = JSON.parse(content);
        console.log('Copilot enhancement successful');
        
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
        console.log('Could not parse Copilot response as JSON');
        console.log('    Response:', content.substring(0, 200));
        return addFallbackContent(data, contractType);
      }
    }

    console.log('    Unexpected Copilot response format');
    return addFallbackContent(data, contractType);
  } catch (error) {
    console.log(`    Copilot API error: ${error.message}`);
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
    enhanced.integrationNotes = `This library accesses shared diamond storage, so changes made through this library are immediately visible to facets using the same storage pattern.`;
    enhanced.keyFeatures = `- Internal functions for use in custom facets\n- Follows diamond storage pattern\n- Compatible with ERC-2535 diamonds`;
  } else {
    enhanced.keyFeatures = `- Complete implementation ready for diamond integration\n- Follows Compose conventions\n- Well-tested and documented`;
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


