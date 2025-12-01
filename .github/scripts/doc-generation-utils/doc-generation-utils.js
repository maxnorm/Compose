const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { readFileSafe } = require('../workflow-utils');
const CONFIG = require('./config');

/**
 * Get list of changed Solidity files from git diff
 * @param {string} baseBranch - Base branch to compare against
 * @returns {string[]} Array of changed .sol file paths
 */
function getChangedSolFiles(baseBranch = 'HEAD~1') {
  try {
    const output = execSync(`git diff --name-only ${baseBranch} HEAD -- 'src/**/*.sol'`, {
      encoding: 'utf8',
    });
    return output.trim().split('\n').filter(f => f.endsWith('.sol'));
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    return [];
  }
}

/**
 * Get all Solidity files in src directory
 * @returns {string[]} Array of .sol file paths
 */
function getAllSolFiles() {
  try {
    const output = execSync('find src -name "*.sol" -type f', {
      encoding: 'utf8',
    });
    return output.trim().split('\n').filter(f => f);
  } catch (error) {
    console.error('Error getting all sol files:', error.message);
    return [];
  }
}

/**
 * Find forge doc output files for a given source file
 * @param {string} solFilePath - Path to .sol file (e.g., 'src/access/AccessControl/LibAccessControl.sol')
 * @returns {string[]} Array of markdown file paths from forge doc output
 */
function findForgeDocFiles(solFilePath) {
  // Transform: src/access/AccessControl/LibAccessControl.sol
  // To: docs/src/src/access/AccessControl/LibAccessControl.sol/
  const relativePath = solFilePath.replace(/^src\//, '');
  const docsDir = path.join(CONFIG.forgeDocsDir, relativePath);

  if (!fs.existsSync(docsDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(docsDir);
    return files
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(docsDir, f));
  } catch (error) {
    console.error(`Error reading docs dir ${docsDir}:`, error.message);
    return [];
  }
}

/**
 * Determine if a contract is a library or facet
 * @param {string} filePath - Path to the file
 * @param {string} content - File content
 * @returns {'library' | 'facet'} Contract type
 */
function getContractType(filePath, content) {
  const lowerPath = filePath.toLowerCase();
  
  // Check path patterns
  if (lowerPath.includes('lib')) {
    return 'library';
  }
  
  if (lowerPath.includes('facet')) {
    return 'facet';
  }

  // Check content patterns
  if (content.includes('library ')) {
    return 'library';
  }

  // Default to facet for contracts
  return 'facet';
}

/**
 * Get output directory based on contract type
 * @param {'library' | 'facet'} contractType - Type of contract
 * @returns {string} Output directory path
 */
function getOutputDir(contractType) {
  return contractType === 'library' 
    ? CONFIG.librariesOutputDir 
    : CONFIG.facetsOutputDir;
}

/**
 * Read changed files from a file (used in CI)
 * @param {string} filePath - Path to file containing list of changed files
 * @returns {string[]} Array of file paths
 */
function readChangedFilesFromFile(filePath) {
  const content = readFileSafe(filePath);
  if (!content) {
    return [];
  }
  return content.trim().split('\n').filter(f => f.endsWith('.sol'));
}

module.exports = {
  getChangedSolFiles,
  getAllSolFiles,
  findForgeDocFiles,
  getContractType,
  getOutputDir,
  readChangedFilesFromFile,
};


