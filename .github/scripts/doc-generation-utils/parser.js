/**
 * Parser for forge doc markdown output
 * Extracts structured data from forge-generated markdown files
 */

/**
 * Parse forge doc markdown output into structured data
 * @param {string} content - Markdown content from forge doc
 * @param {string} filePath - Path to the markdown file
 * @returns {object} Parsed documentation data
 */
function parseForgeDocMarkdown(content, filePath) {
  const data = {
    title: '',
    description: '',
    subtitle: '',
    overview: '',
    gitSource: '',
    functions: [],
    events: [],
    errors: [],
    structs: [],
    stateVariables: [],
  };

  const lines = content.split('\n');
  let currentSection = null;
  let currentItem = null;
  let itemType = null;
  let collectingDescription = false;
  let descriptionBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Parse title (# heading)
    if (line.startsWith('# ') && !data.title) {
      data.title = line.replace('# ', '').trim();
      continue;
    }

    // Parse git source link
    if (trimmedLine.startsWith('[Git Source]')) {
      const match = trimmedLine.match(/\[Git Source\]\((.*?)\)/);
      if (match) {
        data.gitSource = match[1];
      }
      continue;
    }

    // Parse description (first non-empty lines after title, before sections)
    if (data.title && !currentSection && trimmedLine && !line.startsWith('#') && !line.startsWith('[')) {
      if (!data.description) {
        data.description = trimmedLine;
        data.subtitle = trimmedLine;
      } else if (!data.overview) {
        // Capture additional lines as overview
        data.overview = data.description + '\n\n' + trimmedLine;
      }
      continue;
    }

    // Parse main sections
    if (line.startsWith('## ')) {
      const sectionName = line.replace('## ', '').trim().toLowerCase();
      
      // Save current item before switching sections
      if (currentItem) {
        saveCurrentItem(data, currentItem, itemType);
        currentItem = null;
        itemType = null;
      }

      if (sectionName === 'functions') {
        currentSection = 'functions';
      } else if (sectionName === 'events') {
        currentSection = 'events';
      } else if (sectionName === 'errors') {
        currentSection = 'errors';
      } else if (sectionName === 'structs') {
        currentSection = 'structs';
      } else if (sectionName === 'state variables') {
        currentSection = 'stateVariables';
      } else {
        currentSection = null;
      }
      continue;
    }

    // Parse item definitions (### heading)
    if (line.startsWith('### ') && currentSection) {
      // Save previous item
      if (currentItem) {
        saveCurrentItem(data, currentItem, itemType);
      }

      const name = line.replace('### ', '').trim();
      itemType = currentSection;
      currentItem = createNewItem(name, currentSection);
      collectingDescription = true;
      descriptionBuffer = [];
      continue;
    }

    // Process content within current item
    if (currentItem) {
      // Code block with signature
      if (line.startsWith('```solidity')) {
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const codeContent = codeLines.join('\n').trim();
        
        if (currentSection === 'functions' || currentSection === 'events' || currentSection === 'errors') {
          currentItem.signature = codeContent;
          
          // Extract mutability from signature
          if (codeContent.includes(' view ')) {
            currentItem.mutability = 'view';
          } else if (codeContent.includes(' pure ')) {
            currentItem.mutability = 'pure';
          } else if (codeContent.includes(' payable ')) {
            currentItem.mutability = 'payable';
          }
        } else if (currentSection === 'structs') {
          currentItem.definition = codeContent;
        }
        continue;
      }

      // Description text (before **Parameters** or **Returns**)
      if (collectingDescription && trimmedLine && !trimmedLine.startsWith('**') && !trimmedLine.startsWith('|')) {
        descriptionBuffer.push(trimmedLine);
        continue;
      }

      // End description collection on special markers
      if (trimmedLine.startsWith('**Parameters**') || trimmedLine.startsWith('**Returns**')) {
        if (descriptionBuffer.length > 0) {
          currentItem.description = descriptionBuffer.join(' ').trim();
          currentItem.notice = currentItem.description;
          descriptionBuffer = [];
        }
        collectingDescription = false;
      }

      // Parse table rows (Parameters or Returns)
      if (trimmedLine.startsWith('|') && !trimmedLine.includes('----')) {
        const cells = trimmedLine.split('|').map(c => c.trim()).filter(c => c);
        
        // Skip header row
        if (cells.length >= 3 && cells[0] !== 'Name') {
          const paramName = cells[0].replace(/`/g, '');
          const paramType = cells[1].replace(/`/g, '');
          const paramDesc = cells[2] || '';

          // Determine if Parameters or Returns based on preceding lines
          const precedingLines = lines.slice(Math.max(0, i - 10), i).join('\n');
          
          if (precedingLines.includes('**Returns**')) {
            currentItem.returns = currentItem.returns || [];
            currentItem.returns.push({
              name: paramName === '<none>' ? '' : paramName,
              type: paramType,
              description: paramDesc,
            });
          } else if (precedingLines.includes('**Parameters**')) {
            currentItem.params = currentItem.params || [];
            currentItem.params.push({
              name: paramName,
              type: paramType,
              description: paramDesc,
            });
          }
        }
      }
    }
  }

  // Save last item
  if (currentItem) {
    saveCurrentItem(data, currentItem, itemType);
  }

  // Ensure overview is set
  if (!data.overview) {
    data.overview = data.description || `Documentation for ${data.title}.`;
  }

  return data;
}

/**
 * Create a new item object based on section type
 * @param {string} name - Item name
 * @param {string} section - Section type
 * @returns {object} New item object
 */
function createNewItem(name, section) {
  const base = {
    name,
    description: '',
    notice: '',
  };

  switch (section) {
    case 'functions':
      return {
        ...base,
        signature: '',
        params: [],
        returns: [],
        mutability: 'nonpayable',
      };
    case 'events':
      return {
        ...base,
        signature: '',
        params: [],
      };
    case 'errors':
      return {
        ...base,
        signature: '',
        params: [],
      };
    case 'structs':
      return {
        ...base,
        definition: '',
        fields: [],
      };
    case 'stateVariables':
      return {
        ...base,
        type: '',
        value: '',
      };
    default:
      return base;
  }
}

/**
 * Save current item to data object
 * @param {object} data - Data object to save to
 * @param {object} item - Item to save
 * @param {string} type - Item type
 */
function saveCurrentItem(data, item, type) {
  if (!type || !item) return;

  switch (type) {
    case 'functions':
      data.functions.push(item);
      break;
    case 'events':
      data.events.push(item);
      break;
    case 'errors':
      data.errors.push(item);
      break;
    case 'structs':
      data.structs.push(item);
      break;
    case 'stateVariables':
      data.stateVariables.push(item);
      break;
  }
}

/**
 * Extract storage information from parsed data
 * @param {object} data - Parsed documentation data
 * @returns {string | null} Storage information or null
 */
function extractStorageInfo(data) {
  // Look for STORAGE_POSITION in state variables
  const storageVar = data.stateVariables.find(v => 
    v.name.includes('STORAGE') || v.name.includes('storage')
  );

  if (storageVar) {
    return `Storage position: \`${storageVar.name}\` - ${storageVar.description || 'Used for diamond storage pattern.'}`;
  }

  // Look for storage struct
  const storageStruct = data.structs.find(s => 
    s.name.includes('Storage')
  );

  if (storageStruct) {
    return `Uses the \`${storageStruct.name}\` struct following the ERC-8042 diamond storage pattern.`;
  }

  return null;
}

module.exports = {
  parseForgeDocMarkdown,
  extractStorageInfo,
};


