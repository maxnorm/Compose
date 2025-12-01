/**
 * Simple Template Engine
 * 
 * A lightweight template engine with no external dependencies.
 * 
 * Supports:
 * - Variable substitution: {{variable}} (HTML escaped)
 * - Unescaped output: {{{variable}}} (raw output)
 * - Conditionals: {{#if variable}}...{{/if}}
 * - Loops: {{#each array}}...{{/each}}
 * - Helper functions: {{helperName variable}} or {{helperName(arg1, arg2)}}
 * - Dot notation: {{object.property.nested}}
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Escape special characters for YAML frontmatter
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for YAML
 */
function escapeYaml(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .trim();
}

/**
 * Sanitize text to prevent MDX from interpreting it as JSX
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeForMdx(str) {
  if (!str) return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Convert object/array to a safe JavaScript expression for JSX attributes
 * @param {*} obj - Value to convert
 * @returns {string} JSON string safe for JSX
 */
function toJsxExpression(obj) {
  if (obj == null) return 'null';
  
  try {
    let jsonStr = JSON.stringify(obj);
    // Ensure single line
    jsonStr = jsonStr.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
    // Verify it's valid JSON
    JSON.parse(jsonStr);
    return jsonStr;
  } catch (e) {
    console.warn('Invalid JSON generated:', e.message);
    return Array.isArray(obj) ? '[]' : '{}';
  }
}

/**
 * Escape special characters for JSX string attributes
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for JSX attributes
 */
function escapeJsx(str) {
  if (!str) return '';
  
  return sanitizeForMdx(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    .trim();
}

/**
 * Escape markdown table special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for markdown tables
 */
function escapeMarkdownTable(str) {
  if (!str) return '';
  return str
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
}

/**
 * Escape HTML entities for safe display
 * @param {string} str - String to escape
 * @returns {string} HTML-escaped string
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Helper functions registry
 * Add new helpers here to make them available in templates
 */
const helpers = {
  escapeYaml,
  escapeJsx,
  sanitizeMdx: sanitizeForMdx,
  toJsxExpression,
  escapeMarkdownTable,
  escapeHtml,
};

// ============================================================================
// Core Template Engine
// ============================================================================

/**
 * Get value from object using dot notation path
 * @param {object} obj - Object to get value from
 * @param {string} dotPath - Dot notation path (e.g., "user.name")
 * @returns {*} Value at path or undefined
 */
function getValue(obj, dotPath) {
  if (!dotPath || !obj) return undefined;
  
  const parts = dotPath.split('.');
  let value = obj;
  
  for (const part of parts) {
    if (value == null) return undefined;
    value = value[part];
  }
  
  return value;
}

/**
 * Check if a value is truthy for template conditionals
 * - null/undefined → false
 * - empty array → false
 * - empty object → false
 * - empty string → false
 * - false → false
 * - everything else → true
 * 
 * @param {*} value - Value to check
 * @returns {boolean} Whether value is truthy
 */
function isTruthy(value) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
}

/**
 * Process a helper function call
 * @param {string} helperName - Name of the helper
 * @param {string[]} args - Argument strings (variable paths or literals)
 * @param {object} context - Current template context
 * @returns {string} Result of helper function
 */
function processHelper(helperName, args, context) {
  const helper = helpers[helperName];
  if (!helper) {
    console.warn(`Unknown template helper: ${helperName}`);
    return '';
  }
  
  // Process arguments - can be variable paths or quoted literals
  const processedArgs = args.map(arg => {
    arg = arg.trim();
    // Check for quoted literal strings
    if ((arg.startsWith('"') && arg.endsWith('"')) || 
        (arg.startsWith("'") && arg.endsWith("'"))) {
      return arg.slice(1, -1);
    }
    // Otherwise treat as variable path
    return getValue(context, arg);
  });
  
  return helper(...processedArgs);
}

/**
 * Process a variable expression (helper or simple variable)
 * @param {string} expression - The expression inside {{ }}
 * @param {object} context - Current template context
 * @param {boolean} escapeOutput - Whether to HTML-escape the output
 * @returns {string} Processed value
 */
function processExpression(expression, context, escapeOutput = true) {
  const expr = expression.trim();
  
  // Check for helper with parentheses: helperName(arg1, arg2)
  const parenMatch = expr.match(/^(\w+)\((.*)\)$/);
  if (parenMatch) {
    const [, helperName, argsStr] = parenMatch;
    const args = argsStr ? argsStr.split(',').map(a => a.trim()) : [];
    return processHelper(helperName, args, context);
  }
  
  // Check for helper with space: helperName variable
  const spaceMatch = expr.match(/^(\w+)\s+(.+)$/);
  if (spaceMatch && helpers[spaceMatch[1]]) {
    const [, helperName, arg] = spaceMatch;
    return processHelper(helperName, [arg], context);
  }
  
  // Regular variable lookup
  const value = getValue(context, expr);
  if (value == null) return '';
  
  const str = String(value);
  return escapeOutput ? escapeHtml(str) : str;
}

/**
 * Process template content with the given context
 * Handles all variable substitutions, helpers, conditionals, and loops
 * @param {string} content - Template content to process
 * @param {object} context - Data context
 * @returns {string} Processed content
 */
function processContent(content, context) {
  let result = content;
  
  // Process conditionals: {{#if variable}}...{{/if}}
  // Note: This simple implementation doesn't support nested #if blocks
  const ifPattern = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  result = result.replace(ifPattern, (match, condition, ifContent) => {
    const value = getValue(context, condition.trim());
    return isTruthy(value) ? ifContent : '';
  });
  
  // Process loops: {{#each array}}...{{/each}}
  // Note: This simple implementation doesn't support nested #each blocks
  const eachPattern = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  result = result.replace(eachPattern, (match, arrayPath, loopContent) => {
    const array = getValue(context, arrayPath.trim());
    if (!Array.isArray(array) || array.length === 0) {
      return '';
    }
    
    return array.map((item, index) => {
      // Create item context by merging parent context with item properties
      const itemContext = { ...context, ...item, index };
      // Recursively process the loop content
      return processContent(loopContent, itemContext);
    }).join('');
  });
  
  // Process triple braces for unescaped output: {{{variable}}}
  const tripleBracePattern = /\{\{\{([^}]+)\}\}\}/g;
  result = result.replace(tripleBracePattern, (match, expr) => {
    return processExpression(expr, context, false);
  });
  
  // Process double braces for escaped output: {{variable}}
  const doubleBracePattern = /\{\{([^}]+)\}\}/g;
  result = result.replace(doubleBracePattern, (match, expr) => {
    return processExpression(expr, context, true);
  });
  
  return result;
}

/**
 * Render a template string with data
 * @param {string} template - Template string
 * @param {object} data - Data to render
 * @returns {string} Rendered template
 */
function renderTemplate(template, data) {
  if (!template) return '';
  if (!data) data = {};
  
  return processContent(template, { ...data });
}

/**
 * List available template files
 * @returns {string[]} Array of template names (without extension)
 */
function listAvailableTemplates() {
  const templatesDir = path.join(__dirname, 'templates');
  try {
    return fs.readdirSync(templatesDir)
      .filter(f => f.endsWith('.mdx.template'))
      .map(f => f.replace('.mdx.template', ''));
  } catch (e) {
    return [];
  }
}

/**
 * Load and render a template file
 * @param {string} templateName - Name of template (without extension)
 * @param {object} data - Data to render
 * @returns {string} Rendered template
 * @throws {Error} If template cannot be loaded
 */
function loadAndRenderTemplate(templateName, data) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.mdx.template`);
  
  try {
    if (!fs.existsSync(templatePath)) {
      const available = listAvailableTemplates();
      throw new Error(
        `Template '${templateName}' not found at: ${templatePath}\n` +
        `Available templates: ${available.length > 0 ? available.join(', ') : 'none'}`
      );
    }
    
    const template = fs.readFileSync(templatePath, 'utf8');
    return renderTemplate(template, data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const available = listAvailableTemplates();
      throw new Error(
        `Template file not found: ${templatePath}\n` +
        `Available templates: ${available.length > 0 ? available.join(', ') : 'none'}`
      );
    }
    throw error;
  }
}

module.exports = {
  renderTemplate,
  loadAndRenderTemplate,
  getValue,
  isTruthy,
  listAvailableTemplates,
};
