/**
 * Configuration for documentation generation
 * 
 * Centralized configuration for paths, settings, and defaults.
 * Modify this file to change documentation output paths or behavior.
 */

module.exports = {
  // Input paths
  forgeDocsDir: 'docs/src/src',
  
  // Output paths for generated documentation
  facetsOutputDir: 'website/docs/contracts/facets',
  librariesOutputDir: 'website/docs/contracts/libraries',
  
  // Template settings
  defaultSidebarPosition: 99,
  
  // Copilot API settings (for optional enhancement)
  copilot: {
    host: 'api.github.com',
    model: 'gpt-4o',
    maxTokens: 2000,
  },
};

