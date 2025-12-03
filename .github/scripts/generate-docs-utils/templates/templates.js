/**
 * MDX Templates for Docusaurus documentation
 * Uses template files with a simple template engine
 */

const { loadAndRenderTemplate } = require('./template-engine');
const { sanitizeForMdx } = require('./helpers');

/**
 * Extract parameters from function signature string
 * @param {string} signature - Function signature string
 * @returns {Array} Array of parameter objects with name and type
 */
function extractParamsFromSignature(signature) {
  if (!signature || typeof signature !== 'string') return [];
  
  // Match function parameters: function name(params) or just (params)
  const paramMatch = signature.match(/\(([^)]*)\)/);
  if (!paramMatch || !paramMatch[1]) return [];
  
  const paramsStr = paramMatch[1].trim();
  if (!paramsStr) return [];
  
  // Split by comma, but be careful with nested generics
  const params = [];
  let currentParam = '';
  let depth = 0;
  
  for (let i = 0; i < paramsStr.length; i++) {
    const char = paramsStr[i];
    if (char === '<') depth++;
    else if (char === '>') depth--;
    else if (char === ',' && depth === 0) {
      const trimmed = currentParam.trim();
      if (trimmed) {
        // Parse "type name" or just "type"
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
          // Has both type and name
          const type = parts.slice(0, -1).join(' ');
          const name = parts[parts.length - 1];
          params.push({ name, type, description: '' });
        } else if (parts.length === 1) {
          // Just type, no name
          params.push({ name: '', type: parts[0], description: '' });
        }
      }
      currentParam = '';
      continue;
    }
    currentParam += char;
  }
  
  // Handle last parameter
  const trimmed = currentParam.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      const type = parts.slice(0, -1).join(' ');
      const name = parts[parts.length - 1];
      params.push({ name, type, description: '' });
    } else if (parts.length === 1) {
      params.push({ name: '', type: parts[0], description: '' });
    }
  }
  
  return params;
}

/**
 * Prepare function data for template rendering (facet style - with tables)
 * @param {object} fn - Function data
 * @returns {object} Prepared function data
 */
function prepareFacetFunctionData(fn) {
  // Debug: log the raw function data
  if (process.env.DEBUG_PARAMS) {
    console.log(`\n[DEBUG] Function: ${fn.name}`);
    console.log(`[DEBUG] Raw params:`, JSON.stringify(fn.params, null, 2));
    console.log(`[DEBUG] Signature:`, fn.signature);
  }
  
  // Build parameters array, filtering out invalid parameters
  // Invalid parameters include: empty names or names matching the function name (parsing error)
  let paramsArray = (fn.params || [])
    .filter(p => {
      // Handle different possible data structures
      const paramName = (p && (p.name || p.param || p.parameter || '')).trim();
      const paramType = (p && (p.type || p.paramType || '')).trim();
      
      // Filter out parameters with empty or missing names
      if (!paramName) return false;
      // Filter out parameters where name matches function name (indicates parsing error)
      if (paramName === fn.name) {
        if (process.env.DEBUG_PARAMS) {
          console.log(`[DEBUG] Filtered out invalid param: name="${paramName}" matches function name`);
        }
        return false;
      }
      // Filter out if type is empty AND name looks like it might be a function name (starts with lowercase, no underscore)
      if (!paramType && /^[a-z]/.test(paramName) && !paramName.includes('_')) {
        if (process.env.DEBUG_PARAMS) {
          console.log(`[DEBUG] Filtered out suspicious param: name="${paramName}" has no type`);
        }
        return false;
      }
      return true;
    })
    .map(p => ({
      name: (p.name || p.param || p.parameter || '').trim(),
      type: (p.type || p.paramType || '').trim(),
      description: (p.description || p.desc || '').trim(),
    }));
  
  // If no valid parameters found, try extracting from signature
  if (paramsArray.length === 0 && fn.signature) {
    if (process.env.DEBUG_PARAMS) {
      console.log(`[DEBUG] No valid params found, extracting from signature`);
    }
    const extractedParams = extractParamsFromSignature(fn.signature);
    // Apply the same filtering logic to extracted parameters
    paramsArray = extractedParams
      .filter(p => {
        const paramName = (p && (p.name || '')).trim();
        const paramType = (p && (p.type || '')).trim();
        
        // Filter out parameters with empty or missing names
        if (!paramName) return false;
        // Filter out parameters where name matches function name (indicates parsing error)
        if (paramName === fn.name) {
          if (process.env.DEBUG_PARAMS) {
            console.log(`[DEBUG] Filtered out invalid param: name="${paramName}" matches function name`);
          }
          return false;
        }
        // Filter out if type is empty AND name looks like it might be a function name (starts with lowercase, no underscore)
        if (!paramType && /^[a-z]/.test(paramName) && !paramName.includes('_')) {
          if (process.env.DEBUG_PARAMS) {
            console.log(`[DEBUG] Filtered out suspicious param: name="${paramName}" has no type`);
          }
          return false;
        }
        return true;
      })
      .map(p => ({
        name: (p.name || '').trim(),
        type: (p.type || '').trim(),
        description: (p.description || '').trim(),
      }));
    if (process.env.DEBUG_PARAMS) {
      console.log(`[DEBUG] Extracted params from signature:`, JSON.stringify(paramsArray, null, 2));
    }
  }
  
  if (process.env.DEBUG_PARAMS) {
    console.log(`[DEBUG] Final paramsArray:`, JSON.stringify(paramsArray, null, 2));
  }

  // Build returns array for table rendering
  const returnsArray = (fn.returns || []).map(r => ({
    name: r.name || '-',
    type: r.type,
    description: r.description || '',
  }));

  return {
    name: fn.name,
    signature: fn.signature,
    description: fn.notice || fn.description || '',
    params: paramsArray,
    returns: returnsArray,
    hasReturns: returnsArray.length > 0,
    hasParams: paramsArray.length > 0,
  };
}

/**
 * Prepare function data for template rendering (library style - with tables)
 * @param {object} fn - Function data
 * @returns {object} Prepared function data
 */
function prepareLibraryFunctionData(fn) {
  // Debug: log the raw function data
  if (process.env.DEBUG_PARAMS) {
    console.log(`\n[DEBUG] Function: ${fn.name}`);
    console.log(`[DEBUG] Raw params:`, JSON.stringify(fn.params, null, 2));
    console.log(`[DEBUG] Signature:`, fn.signature);
  }
  
  // Build parameters array, filtering out invalid parameters
  // Invalid parameters include: empty names or names matching the function name (parsing error)
  let paramsArray = (fn.params || [])
    .filter(p => {
      // Handle different possible data structures
      const paramName = (p && (p.name || p.param || p.parameter || '')).trim();
      const paramType = (p && (p.type || p.paramType || '')).trim();
      
      // Filter out parameters with empty or missing names
      if (!paramName) return false;
      // Filter out parameters where name matches function name (indicates parsing error)
      if (paramName === fn.name) {
        if (process.env.DEBUG_PARAMS) {
          console.log(`[DEBUG] Filtered out invalid param: name="${paramName}" matches function name`);
        }
        return false;
      }
      // Filter out if type is empty AND name looks like it might be a function name (starts with lowercase, no underscore)
      if (!paramType && /^[a-z]/.test(paramName) && !paramName.includes('_')) {
        if (process.env.DEBUG_PARAMS) {
          console.log(`[DEBUG] Filtered out suspicious param: name="${paramName}" has no type`);
        }
        return false;
      }
      return true;
    })
    .map(p => ({
      name: (p.name || p.param || p.parameter || '').trim(),
      type: (p.type || p.paramType || '').trim(),
      description: (p.description || p.desc || '').trim(),
    }));
  
  // If no valid parameters found, try extracting from signature
  if (paramsArray.length === 0 && fn.signature) {
    if (process.env.DEBUG_PARAMS) {
      console.log(`[DEBUG] No valid params found, extracting from signature`);
    }
    const extractedParams = extractParamsFromSignature(fn.signature);
    // Apply the same filtering logic to extracted parameters
    paramsArray = extractedParams
      .filter(p => {
        const paramName = (p && (p.name || '')).trim();
        const paramType = (p && (p.type || '')).trim();
        
        // Filter out parameters with empty or missing names
        if (!paramName) return false;
        // Filter out parameters where name matches function name (indicates parsing error)
        if (paramName === fn.name) {
          if (process.env.DEBUG_PARAMS) {
            console.log(`[DEBUG] Filtered out invalid param: name="${paramName}" matches function name`);
          }
          return false;
        }
        // Filter out if type is empty AND name looks like it might be a function name (starts with lowercase, no underscore)
        if (!paramType && /^[a-z]/.test(paramName) && !paramName.includes('_')) {
          if (process.env.DEBUG_PARAMS) {
            console.log(`[DEBUG] Filtered out suspicious param: name="${paramName}" has no type`);
          }
          return false;
        }
        return true;
      })
      .map(p => ({
        name: (p.name || '').trim(),
        type: (p.type || '').trim(),
        description: (p.description || '').trim(),
      }));
    if (process.env.DEBUG_PARAMS) {
      console.log(`[DEBUG] Extracted params from signature:`, JSON.stringify(paramsArray, null, 2));
    }
  }
  
  if (process.env.DEBUG_PARAMS) {
    console.log(`[DEBUG] Final paramsArray:`, JSON.stringify(paramsArray, null, 2));
  }

  // Build returns array for library template (expects array for table rendering)
  const returnsArray = (fn.returns || []).map(r => ({
    name: r.name || '-',
    type: r.type,
    description: r.description || '',
  }));

  return {
    name: fn.name,
    signature: fn.signature,
    description: fn.notice || fn.description || '',
    params: paramsArray,
    returns: returnsArray,
    hasReturns: returnsArray.length > 0,
    hasParams: paramsArray.length > 0,
  };
}

/**
 * Prepare event data for template rendering
 * @param {object} event - Event data
 * @returns {object} Prepared event data
 */
function prepareEventData(event) {
  return {
    name: event.name,
    description: event.description || '',
    signature: event.signature,
    params: (event.params || []).map(p => ({
      name: p.name,
      type: p.type,
      description: p.description || '',
    })),
    hasParams: (event.params || []).length > 0,
  };
}

/**
 * Prepare error data for template rendering
 * @param {object} error - Error data
 * @returns {object} Prepared error data
 */
function prepareErrorData(error) {
  return {
    name: error.name,
    description: error.description || '',
    signature: error.signature,
  };
}

/**
 * Prepare struct data for template rendering
 * @param {object} struct - Struct data
 * @returns {object} Prepared struct data
 */
function prepareStructData(struct) {
  return {
    name: struct.name,
    description: struct.description || '',
    definition: struct.definition,
  };
}

/**
 * Validate documentation data
 * @param {object} data - Documentation data to validate
 * @throws {Error} If data is invalid
 */
function validateData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data: expected an object');
  }
  if (!data.title || typeof data.title !== 'string') {
    throw new Error('Invalid data: missing or invalid title');
  }
}

/**
 * Prepare base data common to both facet and library templates
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {object} Base prepared data
 */
function prepareBaseData(data, position = 99) {
  validateData(data);
  
  const description = data.description || `Contract documentation for ${data.title}`;
  const subtitle = data.subtitle || data.description || `Contract documentation for ${data.title}`;
  const overview = data.overview || data.description || `Documentation for ${data.title}.`;

  return {
    position,
    title: data.title,
    description,
    subtitle,
    overview,
    gitSource: data.gitSource || '',
    keyFeatures: data.keyFeatures || '',
    usageExample: data.usageExample || '',
    bestPractices: data.bestPractices || '',
    securityConsiderations: data.securityConsiderations || '',
    integrationNotes: data.integrationNotes || '',
    storageInfo: data.storageInfo || '',
    
    // Events
    events: (data.events || []).map(prepareEventData),
    hasEvents: (data.events || []).length > 0,
    
    // Errors
    errors: (data.errors || []).map(prepareErrorData),
    hasErrors: (data.errors || []).length > 0,
    
    // Structs
    structs: (data.structs || []).map(prepareStructData),
    hasStructs: (data.structs || []).length > 0,
    
    // State variables (for libraries)
    stateVariables: (data.stateVariables || []).map(v => ({
      name: v.name,
      description: v.description || '',
    })),
    hasStateVariables: (data.stateVariables || []).length > 0,
    hasStorage: Boolean(data.storageInfo || (data.stateVariables && data.stateVariables.length > 0)),
  };
}

/**
 * Prepare data for facet template rendering
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {object} Prepared data for facet template
 */
function prepareFacetData(data, position = 99) {
  const baseData = prepareBaseData(data, position);
  
  return {
    ...baseData,
    // Functions with APIReference-compatible format
    functions: (data.functions || []).map(prepareFacetFunctionData),
    hasFunctions: (data.functions || []).length > 0,
  };
}

/**
 * Prepare data for library template rendering
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {object} Prepared data for library template
 */
function prepareLibraryData(data, position = 99) {
  const baseData = prepareBaseData(data, position);
  
  return {
    ...baseData,
    // Functions with table-compatible format (returns as array)
    functions: (data.functions || []).map(prepareLibraryFunctionData),
    hasFunctions: (data.functions || []).length > 0,
  };
}

/**
 * Generate complete facet documentation
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {string} Complete MDX document
 */
function generateFacetDoc(data, position = 99) {
  const preparedData = prepareFacetData(data, position);
  return loadAndRenderTemplate('facet', preparedData);
}

/**
 * Generate complete library documentation
 * @param {object} data - Documentation data
 * @param {number} position - Sidebar position
 * @returns {string} Complete MDX document
 */
function generateLibraryDoc(data, position = 99) {
  const preparedData = prepareLibraryData(data, position);
  return loadAndRenderTemplate('library', preparedData);
}

module.exports = {
  generateFacetDoc,
  generateLibraryDoc,
};
