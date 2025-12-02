/**
 * Docusaurus Documentation Generator
 * 
 * Converts forge doc output to Docusaurus MDX format
 * with optional GitHub Copilot enhancement.
 * 
 * Environment variables:
 *   GITHUB_TOKEN - GitHub token for Copilot API (optional)
 *   SKIP_ENHANCEMENT - Set to 'true' to skip Copilot enhancement
 */

const path = require('path');
const {
  getAllSolFiles,
  findForgeDocFiles,
  isInterface,
  getContractType,
  getOutputDir,
  readChangedFilesFromFile,
} = require('./generate-docs-utils/doc-generation-utils');
const { readFileSafe, writeFileSafe } = require('./workflow-utils');
const { parseForgeDocMarkdown, extractStorageInfo } = require('./generate-docs-utils/forge-doc-parser');
const { generateFacetDoc, generateLibraryDoc } = require('./generate-docs-utils/templates/templates');
const { enhanceWithCopilot, shouldSkipEnhancement } = require('./generate-docs-utils/copilot-enhancement');

// Track processed files for summary
const processedFiles = {
  facets: [],
  libraries: [],
  skipped: [],
  errors: [],
};

/**
 * Process a single forge doc markdown file
 * @param {string} forgeDocFile - Path to forge doc markdown file
 * @param {string} solFilePath - Original .sol file path
 * @returns {Promise<boolean>} True if processed successfully
 */
async function processForgeDocFile(forgeDocFile, solFilePath) {
  const content = readFileSafe(forgeDocFile);
  if (!content) {
    console.log(`Could not read: ${forgeDocFile}`);
    processedFiles.errors.push({ file: forgeDocFile, error: 'Could not read file' });
    return false;
  }

  // Parse the forge doc markdown
  const data = parseForgeDocMarkdown(content, forgeDocFile);

  if (!data.title) {
    console.log(`Could not parse title from: ${forgeDocFile}`);
    processedFiles.skipped.push({ file: forgeDocFile, reason: 'No title found' });
    return false;
  }

  // Skip interfaces - only generate docs for facets and libraries
  if (isInterface(data.title, content)) {
    console.log(`Skipping interface: ${data.title}`);
    processedFiles.skipped.push({ file: forgeDocFile, reason: 'Interface (filtered)' });
    return false;
  }

  // Determine contract type
  const contractType = getContractType(forgeDocFile, content);
  console.log(`Type: ${contractType} - ${data.title}`);

  // Extract storage info for libraries
  if (contractType === 'library') {
    data.storageInfo = extractStorageInfo(data);
  }

  // Check if we should skip enhancement (e.g., for interfaces)
  const skipEnhancement = shouldSkipEnhancement(data) || process.env.SKIP_ENHANCEMENT === 'true';

  // Enhance with Copilot if not skipped
  let enhancedData = data;
  if (!skipEnhancement) {
    const token = process.env.GITHUB_TOKEN;
    enhancedData = await enhanceWithCopilot(data, contractType, token);
  } else {
    console.log(`Skipping enhancement for ${data.title}`);
  }

  // Generate MDX content
  const mdxContent = contractType === 'library'
    ? generateLibraryDoc(enhancedData)
    : generateFacetDoc(enhancedData);

  // Determine output path
  const outputDir = getOutputDir(contractType);
  const outputFile = path.join(outputDir, `${data.title}.mdx`);

  // Write the file
  if (writeFileSafe(outputFile, mdxContent)) {
    console.log('✅  Generated:', outputFile);
    
    if (contractType === 'library') {
      processedFiles.libraries.push({ title: data.title, file: outputFile });
    } else {
      processedFiles.facets.push({ title: data.title, file: outputFile });
    }
    
    return true;
  }

  processedFiles.errors.push({ file: outputFile, error: 'Could not write file' });
  return false;
}

/**
 * Process a Solidity source file
 * @param {string} solFilePath - Path to .sol file
 * @returns {Promise<void>}
 */
async function processSolFile(solFilePath) {
  console.log(`Processing: ${solFilePath}`);

  const forgeDocFiles = findForgeDocFiles(solFilePath);

  if (forgeDocFiles.length === 0) {
    console.log(`No forge doc output found for: ${solFilePath}`);
    processedFiles.skipped.push({ file: solFilePath, reason: 'No forge doc output' });
    return;
  }

  for (const forgeDocFile of forgeDocFiles) {
    console.log(`Reading: ${path.basename(forgeDocFile)}`);
    await processForgeDocFile(forgeDocFile, solFilePath);
  }
}

/**
 * Print processing summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('Documentation Generation Summary');
  console.log('='.repeat(50));

  console.log(`\nFacets generated: ${processedFiles.facets.length}`);
  for (const f of processedFiles.facets) {
    console.log(`   - ${f.title}`);
  }

  console.log(`\nLibraries generated: ${processedFiles.libraries.length}`);
  for (const l of processedFiles.libraries) {
    console.log(`   - ${l.title}`);
  }

  if (processedFiles.skipped.length > 0) {
    console.log(`\nSkipped: ${processedFiles.skipped.length}`);
    for (const s of processedFiles.skipped) {
      console.log(`   - ${path.basename(s.file)}: ${s.reason}`);
    }
  }

  if (processedFiles.errors.length > 0) {
    console.log(`\nErrors: ${processedFiles.errors.length}`);
    for (const e of processedFiles.errors) {
      console.log(`   - ${path.basename(e.file)}: ${e.error}`);
    }
  }

  const total = processedFiles.facets.length + processedFiles.libraries.length;
  console.log(`\nTotal generated: ${total} documentation files`);
  console.log('='.repeat(50) + '\n');
}

/**
 * Write summary to file for GitHub Action
 */
function writeSummaryFile() {
  const summary = {
    timestamp: new Date().toISOString(),
    facets: processedFiles.facets,
    libraries: processedFiles.libraries,
    skipped: processedFiles.skipped,
    errors: processedFiles.errors,
    totalGenerated: processedFiles.facets.length + processedFiles.libraries.length,
  };

  writeFileSafe('docgen-summary.json', JSON.stringify(summary, null, 2));
}

/**
 * Main entry point
 */
async function main() {
  console.log('Compose Documentation Generator\n');

  const args = process.argv.slice(2);
  let solFiles = [];

  if (args.includes('--all')) {
    // Process all Solidity files
    console.log('Processing all Solidity files...');
    solFiles = getAllSolFiles();
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    // Process files from list
    const changedFilesPath = args[0];
    console.log(`Reading changed files from: ${changedFilesPath}`);
    solFiles = readChangedFilesFromFile(changedFilesPath);
    
    if (solFiles.length === 0) {
      // If file doesn't exist or is empty, try getting from git
      console.log('No files in list, checking git diff...');
      const { getChangedSolFiles } = require('./generate-docs-utils/doc-generation-utils');
      solFiles = getChangedSolFiles();
    }
  } else {
    // Default: get changed files from git
    console.log('Getting changed Solidity files from git...');
    const { getChangedSolFiles } = require('./generate-docs-utils/doc-generation-utils');
    solFiles = getChangedSolFiles();
  }

  if (solFiles.length === 0) {
    console.log('No Solidity files to process');
    return;
  }

  console.log(`Found ${solFiles.length} Solidity file(s) to process\n`);

  // Process each file
  for (const solFile of solFiles) {
    await processSolFile(solFile);
    console.log(''); // Empty line between files
  }

  // Print and save summary
  printSummary();
  writeSummaryFile();
}

// Run main
main().catch((error) => {
  console.error(`Fatal error: ${error}`);
  process.exit(1);
});


