/**
 * Prints Markdown release notes for a Git tag.
 *
 * Modes (RELEASE_NOTES_MODE or 4th argv: "pr" | "commits"):
 * - pr: merged PRs linked to commits in range, filtered by changed files vs releaseNotesPaths
 * - commits: path-filtered git log (escape hatch)
 *
 * PR lines: title by @author in #N (PR opener). @mentions power GitHub’s release avatar strip.
 *
 * Usage:
 *   node release-notes.js <fullTag> <tagPrefix> <pathsJson> [mode]
 * Env: GITHUB_REPOSITORY=owner/name, RELEASE_NOTES_MODE, GH_TOKEN or GITHUB_TOKEN
 */

const { execFile } = require('child_process');
const { promisify } = require('util');
const {
  execGit,
  listTagsForPrefix,
  previousTag,
} = require('./release-notes-tags.js');

const execFileAsync = promisify(execFile);

/**
 * Path rules match git pathspec-style prefixes: exact file or directory prefix.
 * e.g. "cli" matches "cli/foo"; "foundry.toml" matches only root foundry.toml.
 */
function matchesReleasePath(filePath, rules) {
  const p = filePath.replace(/\\/g, '/');
  for (const r of rules) {
    const rule = r.replace(/\\/g, '/');
    if (p === rule || p.startsWith(`${rule}/`)) {
      return true;
    }
  }
  return false;
}

function parseRepo() {
  const raw = process.env.GITHUB_REPOSITORY;
  if (!raw || !raw.includes('/')) {
    throw new Error(
      'GITHUB_REPOSITORY (owner/repo) is required for PR-based release notes',
    );
  }
  const [owner, repo] = raw.split('/');
  return { owner, repo };
}

async function ghApiJson(apiPath) {
  const { stdout } = await execFileAsync('gh', ['api', apiPath], {
    maxBuffer: 50 * 1024 * 1024,
    encoding: 'utf8',
  });
  return JSON.parse(stdout);
}

async function fetchAllPullFiles(owner, repo, pullNumber) {
  const files = [];
  for (let page = 1; page <= 500; page += 1) {
    const path = `repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=100&page=${page}`;
    const pageFiles = await ghApiJson(path);
    if (!Array.isArray(pageFiles) || pageFiles.length === 0) {
      break;
    }
    files.push(...pageFiles);
    if (pageFiles.length < 100) {
      break;
    }
  }
  return files;
}

async function mapLimit(items, limit, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += limit) {
    const slice = items.slice(i, i + limit);
    out.push(...(await Promise.all(slice.map(fn))));
  }
  return out;
}

function gitRevListShas(prev, tag) {
  const args = prev
    ? ['rev-list', `${prev}..${tag}`]
    : ['rev-list', '--max-count=400', tag];
  try {
    const raw = execGit(args);
    return raw ? raw.split('\n').filter(Boolean) : [];
  } catch {
    return [];
  }
}

function commitTouchesPaths(sha, rules) {
  try {
    const names = execGit([
      'diff-tree',
      '--no-commit-id',
      '--name-only',
      '-r',
      sha,
    ]);
    const files = names.split('\n').filter(Boolean);
    return files.some(f => matchesReleasePath(f, rules));
  } catch {
    return false;
  }
}

function commitSubject(sha) {
  try {
    return execGit(['log', '-1', '--pretty=format:%s', sha]);
  } catch {
    return sha.slice(0, 7);
  }
}

async function fetchPullsForCommit(owner, repo, sha) {
  const path = `repos/${owner}/${repo}/commits/${sha}/pulls`;
  try {
    const data = await ghApiJson(path);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function renderCommitMode(paths, prev, tag) {
  const rangeArgs = prev ? [`${prev}..${tag}`] : [tag, '--max-count=400'];
  const logArgs = [
    'log',
    ...rangeArgs,
    '--pretty=format:- %s (%h)',
    '--',
    ...paths,
  ];
  let lines;
  try {
    lines = execGit(logArgs);
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
  const body =
    lines.length > 0
      ? lines
      : '_No commits touched the configured paths in this range._';
  return `## Changes (paths: ${paths.join(', ')})\n\n${body}\n`;
}

function formatPrLine(p) {
  const by = p.author_login ? ` by @${p.author_login}` : '';
  return `- ${p.title}${by} in [#${p.number}](${p.html_url})`;
}

async function renderPrMode(tag, tagPrefix, paths) {
  const { owner, repo } = parseRepo();
  const tags = listTagsForPrefix(tagPrefix);
  const prev = previousTag(tags, tag);

  const shas = gitRevListShas(prev, tag);
  if (shas.length === 0) {
    return `## Merged pull requests (paths: ${paths.join(', ')})\n\n_No commits in this tag range._\n`;
  }

  const pullsArrays = await mapLimit(shas, 12, async sha =>
    fetchPullsForCommit(owner, repo, sha),
  );

  const prNumbers = new Set();
  for (const pulls of pullsArrays) {
    for (const pr of pulls) {
      if (pr && typeof pr.number === 'number') {
        prNumbers.add(pr.number);
      }
    }
  }

  const sortedNums = [...prNumbers].sort((a, b) => a - b);

  const included = [];
  for (const num of sortedNums) {
    const files = await fetchAllPullFiles(owner, repo, num);
    if (!files.some(f => f.filename && matchesReleasePath(f.filename, paths))) {
      continue;
    }
    const detail = await ghApiJson(`repos/${owner}/${repo}/pulls/${num}`);
    const authorLogin =
      detail.user && typeof detail.user.login === 'string'
        ? detail.user.login
        : null;
    included.push({
      number: num,
      title: detail.title || `PR #${num}`,
      html_url:
        detail.html_url ||
        `https://github.com/${owner}/${repo}/pull/${num}`,
      merged_at: detail.merged_at || null,
      author_login: authorLogin,
    });
  }

  included.sort((a, b) => {
    if (a.merged_at && b.merged_at) {
      return new Date(b.merged_at) - new Date(a.merged_at);
    }
    return b.number - a.number;
  });

  const lines = included.map(formatPrLine);

  const orphanLines = [];
  for (let i = 0; i < shas.length; i += 1) {
    const sha = shas[i];
    const pulls = pullsArrays[i];
    if (pulls.length > 0) {
      continue;
    }
    if (commitTouchesPaths(sha, paths)) {
      orphanLines.push(`- ${commitSubject(sha)} (\`${sha.slice(0, 7)}\`)`);
    }
  }

  let md = `## Merged pull requests (paths: ${paths.join(', ')})\n\n`;
  if (lines.length > 0) {
    md += `${lines.join('\n')}\n`;
  } else {
    md += '_No merged PRs in this range matched these paths._\n';
  }

  if (orphanLines.length > 0) {
    md += `\n### Other commits (no linked PR)\n\n${orphanLines.join('\n')}\n`;
  }

  md += "### Thank you to all the contributors who helped make this release.\n\n";

  return md;
}

function resolveMode(argvMode, envMode) {
  const v = (argvMode || envMode || 'pr').toLowerCase();
  if (v === 'commits') {
    return 'commits';
  }
  return 'pr';
}

async function main() {
  const [tag, tagPrefix, pathsJson, argvMode] = process.argv.slice(2);
  if (!tag || !tagPrefix || !pathsJson) {
    console.error(
      'Usage: release-notes.js <fullTag> <tagPrefix> <pathsJson> [pr|commits]',
    );
    process.exit(1);
  }

  let paths;
  try {
    paths = JSON.parse(pathsJson);
  } catch {
    console.error('pathsJson must be valid JSON array of path strings');
    process.exit(1);
  }
  if (!Array.isArray(paths) || paths.length === 0) {
    console.error('paths must be a non-empty array');
    process.exit(1);
  }

  const mode = resolveMode(argvMode, process.env.RELEASE_NOTES_MODE);

  if (mode === 'commits') {
    const tags = listTagsForPrefix(tagPrefix);
    const prev = previousTag(tags, tag);
    process.stdout.write(renderCommitMode(paths, prev, tag));
    return;
  }

  try {
    const md = await renderPrMode(tag, tagPrefix, paths);
    process.stdout.write(md);
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
}

main();
