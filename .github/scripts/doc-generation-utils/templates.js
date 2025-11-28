/**
 * MDX Templates for Docusaurus documentation
 * Generates rich documentation pages with custom components
 */

/**
 * Generate the frontmatter and imports section
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {string} Frontmatter and imports
 */
function generateHeader(data, position = 99) {
  const description = data.description || `API documentation for ${data.title}`;
  
  return `---
sidebar_position: ${position}
title: "${escapeYaml(data.title)}"
description: "${escapeYaml(description)}"
---

import DocHero from '@site/src/components/docs/DocHero';
import Callout from '@site/src/components/ui/Callout';
import APIReference from '@site/src/components/api/APIReference';

`;
}

/**
 * Generate the hero section
 * @param {object} data - Documentation data
 * @returns {string} Hero component JSX
 */
function generateHero(data) {
  const subtitle = data.subtitle || data.description || `API documentation for ${data.title}`;
  
  return `<DocHero
  title="${escapeJsx(data.title)}"
  subtitle="${escapeJsx(subtitle)}"
  variant="gradient"
  height="small"
/>

`;
}

/**
 * Generate the overview section
 * @param {object} data - Documentation data
 * @returns {string} Overview markdown
 */
function generateOverview(data) {
  let overview = `## Overview\n\n`;
  overview += `${data.overview || data.description || `Documentation for ${data.title}.`}\n\n`;

  if (data.gitSource) {
    overview += `[View Source](${data.gitSource})\n\n`;
  }

  return overview;
}

/**
 * Generate the key features callout
 * @param {object} data - Documentation data
 * @returns {string} Key features callout
 */
function generateKeyFeatures(data) {
  if (!data.keyFeatures) return '';

  return `<Callout type="info" title="Key Features">
${data.keyFeatures}
</Callout>

`;
}

/**
 * Generate function documentation using APIReference component
 * @param {object} fn - Function data
 * @returns {string} Function documentation
 */
function generateFunctionDoc(fn) {
  const method = (fn.mutability === 'view' || fn.mutability === 'pure') ? 'GET' : 'POST';
  
  let doc = `### ${fn.name}\n\n`;
  
  // Show signature as code block if available
  if (fn.signature) {
    doc += `\`\`\`solidity
${fn.signature}
\`\`\`\n\n`;
  }
  
  // Sanitize description for markdown context (escape JSX-like syntax)
  if (fn.description) {
    const safeDescription = sanitizeForMdx(fn.description);
    doc += `${safeDescription}\n\n`;
  }

  // Build parameters array - sanitize descriptions to prevent MDX parsing issues
  const paramsArray = fn.params.map(p => ({
    name: p.name,
    type: p.type,
    required: true,
    description: sanitizeForMdx(p.description || ''),
  }));

  // Use function name as endpoint instead of full signature to avoid JSX parsing issues
  // The full signature is shown above as a code block
  const endpoint = fn.name;

  // Stringify parameters as a single line to avoid MDX parsing issues with multiline JSON
  const paramsJson = JSON.stringify(paramsArray);
  
  doc += `<APIReference
  method="${method}"
  endpoint="${escapeJsx(endpoint)}"
  description="${escapeJsx(fn.notice || fn.description || '')}"
  parameters={${paramsJson}}
`;

  // Add response if there are returns - sanitize descriptions
  if (fn.returns && fn.returns.length > 0) {
    const responseObj = {};
    fn.returns.forEach((r, idx) => {
      const key = r.name || `result${idx > 0 ? idx + 1 : ''}`;
      const value = r.description || r.type;
      responseObj[key] = sanitizeForMdx(value);
    });
    // Stringify response as a single line to avoid MDX parsing issues
    const responseJson = JSON.stringify(responseObj);
    doc += `  response={${responseJson}}
`;
  }

  doc += `/>\n\n`;

  return doc;
}

/**
 * Generate functions section
 * @param {object} data - Documentation data
 * @returns {string} Functions section
 */
function generateFunctionsSection(data) {
  if (!data.functions || data.functions.length === 0) return '';

  let section = `## Functions\n\n`;

  for (const fn of data.functions) {
    section += generateFunctionDoc(fn);
  }

  return section;
}

/**
 * Generate library-specific function documentation (table format)
 * @param {object} fn - Function data
 * @returns {string} Function documentation
 */
function generateLibraryFunctionDoc(fn) {
  let doc = `### ${fn.name}\n\n`;

  if (fn.description) {
    doc += `${fn.description}\n\n`;
  }

  if (fn.signature) {
    doc += `\`\`\`solidity
${fn.signature}
\`\`\`\n\n`;
  }

  if (fn.params && fn.params.length > 0) {
    doc += `**Parameters**\n\n`;
    doc += `| Name | Type | Description |\n`;
    doc += `|------|------|-------------|\n`;
    for (const p of fn.params) {
      // Escape pipe characters and other markdown special chars in descriptions
      const safeDesc = (p.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      doc += `| \`${p.name}\` | \`${p.type}\` | ${safeDesc} |\n`;
    }
    doc += `\n`;
  }

  if (fn.returns && fn.returns.length > 0) {
    doc += `**Returns**\n\n`;
    doc += `| Name | Type | Description |\n`;
    doc += `|------|------|-------------|\n`;
    for (const r of fn.returns) {
      // Escape pipe characters and other markdown special chars in descriptions
      const safeDesc = (r.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      doc += `| \`${r.name || '-'}\` | \`${r.type}\` | ${safeDesc} |\n`;
    }
    doc += `\n`;
  }

  return doc;
}

/**
 * Generate library functions section
 * @param {object} data - Documentation data
 * @returns {string} Functions section for library
 */
function generateLibraryFunctionsSection(data) {
  if (!data.functions || data.functions.length === 0) return '';

  let section = `## Functions\n\n`;

  for (const fn of data.functions) {
    section += generateLibraryFunctionDoc(fn);
  }

  return section;
}

/**
 * Generate events section
 * @param {object} data - Documentation data
 * @returns {string} Events section
 */
function generateEventsSection(data) {
  if (!data.events || data.events.length === 0) return '';

  let section = `## Events\n\n`;

  for (const event of data.events) {
    section += `### ${event.name}\n\n`;
    
    if (event.description) {
      section += `${event.description}\n\n`;
    }

    if (event.signature) {
      section += `\`\`\`solidity
${event.signature}
\`\`\`\n\n`;
    }

    if (event.params && event.params.length > 0) {
      section += `| Parameter | Type | Description |\n`;
      section += `|-----------|------|-------------|\n`;
      for (const p of event.params) {
        // Escape pipe characters and other markdown special chars in descriptions
        const safeDesc = (p.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
        section += `| \`${p.name}\` | \`${p.type}\` | ${safeDesc} |\n`;
      }
      section += `\n`;
    }
  }

  return section;
}

/**
 * Generate errors section
 * @param {object} data - Documentation data
 * @returns {string} Errors section
 */
function generateErrorsSection(data) {
  if (!data.errors || data.errors.length === 0) return '';

  let section = `## Errors\n\n`;

  for (const error of data.errors) {
    section += `### ${error.name}\n\n`;
    
    if (error.description) {
      section += `${error.description}\n\n`;
    }

    if (error.signature) {
      section += `\`\`\`solidity
${error.signature}
\`\`\`\n\n`;
    }
  }

  return section;
}

/**
 * Generate structs section
 * @param {object} data - Documentation data
 * @returns {string} Structs section
 */
function generateStructsSection(data) {
  if (!data.structs || data.structs.length === 0) return '';

  let section = `## Structs\n\n`;

  for (const struct of data.structs) {
    section += `### ${struct.name}\n\n`;
    
    if (struct.description) {
      section += `${struct.description}\n\n`;
    }

    if (struct.definition) {
      section += `\`\`\`solidity
${struct.definition}
\`\`\`\n\n`;
    }
  }

  return section;
}

/**
 * Generate usage example section
 * @param {object} data - Documentation data
 * @returns {string} Usage example section
 */
function generateUsageExample(data) {
  if (!data.usageExample) return '';

  return `## Usage Example

\`\`\`solidity
${data.usageExample}
\`\`\`

`;
}

/**
 * Generate best practices callout
 * @param {object} data - Documentation data
 * @returns {string} Best practices callout
 */
function generateBestPractices(data) {
  if (!data.bestPractices) return '';

  return `## Best Practices

<Callout type="tip" title="Best Practice">
${data.bestPractices}
</Callout>

`;
}

/**
 * Generate security considerations callout
 * @param {object} data - Documentation data
 * @returns {string} Security considerations callout
 */
function generateSecurityConsiderations(data) {
  if (!data.securityConsiderations) return '';

  return `## Security Considerations

<Callout type="warning" title="Security">
${data.securityConsiderations}
</Callout>

`;
}

/**
 * Generate integration notes callout (for libraries)
 * @param {object} data - Documentation data
 * @returns {string} Integration notes callout
 */
function generateIntegrationNotes(data) {
  if (!data.integrationNotes) return '';

  return `## Integration Notes

<Callout type="success" title="Shared Storage">
${data.integrationNotes}
</Callout>

`;
}

/**
 * Generate storage info section (for libraries)
 * @param {object} data - Documentation data
 * @returns {string} Storage section
 */
function generateStorageSection(data) {
  if (!data.storageInfo && (!data.stateVariables || data.stateVariables.length === 0)) {
    return '';
  }

  let section = `## Storage\n\n`;

  if (data.storageInfo) {
    section += `${data.storageInfo}\n\n`;
  }

  if (data.stateVariables && data.stateVariables.length > 0) {
    section += `### State Variables\n\n`;
    for (const v of data.stateVariables) {
      section += `#### ${v.name}\n\n`;
      if (v.description) {
        section += `${v.description}\n\n`;
      }
    }
  }

  return section;
}

/**
 * Generate complete facet documentation
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {string} Complete MDX document
 */
function generateFacetDoc(data, position = 99) {
  let doc = '';

  doc += generateHeader(data, position);
  doc += generateHero(data);
  doc += generateOverview(data);
  doc += generateKeyFeatures(data);
  doc += generateFunctionsSection(data);
  doc += generateEventsSection(data);
  doc += generateErrorsSection(data);
  doc += generateStructsSection(data);
  doc += generateUsageExample(data);
  doc += generateBestPractices(data);
  doc += generateSecurityConsiderations(data);

  return doc;
}

/**
 * Generate complete library documentation
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {string} Complete MDX document
 */
function generateLibraryDoc(data, position = 99) {
  let doc = '';

  doc += generateHeader(data, position);
  doc += generateHero(data);
  doc += generateOverview(data);

  // Library-specific intro callout
  doc += `<Callout type="info" title="Library Usage">
This library provides internal functions for use in your custom facets. Import it to access shared storage.
</Callout>

`;

  doc += generateStorageSection(data);
  doc += generateLibraryFunctionsSection(data);
  doc += generateEventsSection(data);
  doc += generateErrorsSection(data);
  doc += generateStructsSection(data);
  doc += generateUsageExample(data);
  doc += generateBestPractices(data);
  doc += generateIntegrationNotes(data);

  return doc;
}

/**
 * Escape special characters for YAML
 * @param {string} str - String to escape
 * @returns {string} Escaped string (ready to be wrapped in quotes)
 */
function escapeYaml(str) {
  if (!str) return '';
  // Escape quotes and newlines, and remove any trailing/leading whitespace
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/"/g, '\\"')     // Escape double quotes
    .replace(/\n/g, ' ')      // Replace newlines with spaces
    .trim();                  // Remove leading/trailing whitespace
}

/**
 * Sanitize text to prevent MDX from interpreting it as JSX
 * Escapes angle brackets and other characters that could break MDX parsing
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeForMdx(str) {
  if (!str) return '';
  
  // Escape all angle brackets to prevent MDX from trying to parse JSX
  // This is safe for markdown content where we want literal angle brackets
  return str
    .replace(/</g, '&lt;')  // Escape less-than
    .replace(/>/g, '&gt;');  // Escape greater-than
}

/**
 * Escape special characters for JSX attributes
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeJsx(str) {
  if (!str) return '';
  
  // First sanitize to prevent MDX parsing issues
  let escaped = sanitizeForMdx(str);
  
  // Then escape for JSX attributes
  return escaped
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/"/g, '\\"')     // Escape double quotes
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/\n/g, ' ')      // Replace newlines with spaces
    .replace(/</g, '&lt;')    // Escape less-than (in case sanitizeForMdx missed any)
    .replace(/>/g, '&gt;')    // Escape greater-than (in case sanitizeForMdx missed any)
    .replace(/\{/g, '&#123;') // Escape opening braces
    .replace(/\}/g, '&#125;') // Escape closing braces
    .trim();                 // Remove leading/trailing whitespace
}

module.exports = {
  generateFacetDoc,
  generateLibraryDoc,
  generateHeader,
  generateHero,
  generateOverview,
  generateFunctionsSection,
  generateLibraryFunctionsSection,
  generateEventsSection,
  generateErrorsSection,
  generateStructsSection,
  generateUsageExample,
  generateBestPractices,
  generateSecurityConsiderations,
  generateIntegrationNotes,
};


