/**
 * Shared helpers for release note tag ranges (same tagPrefix family).
 */

const { execFileSync } = require('child_process');

function execGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

/**
 * Lists tags matching `${tagPrefix}@*`, newest first (Git version sort).
 */
function listTagsForPrefix(tagPrefix) {
  const pattern = `${tagPrefix}@*`;
  try {
    return execGit(['tag', '-l', pattern, '--sort=-version:refname'])
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Returns the older tag adjacent to `currentTag` in the sorted list, or null.
 */
function previousTag(tags, currentTag) {
  const i = tags.indexOf(currentTag);
  if (i === -1 || i >= tags.length - 1) {
    return null;
  }
  return tags[i + 1];
}

module.exports = {
  execGit,
  listTagsForPrefix,
  previousTag,
};
