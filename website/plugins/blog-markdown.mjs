import path from 'node:path';

function getFrontMatter(content) {
  return content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
}

function parseScalar(value) {
  const scalar = value.trim();
  if (
    (scalar.startsWith('"') && scalar.endsWith('"')) ||
    (scalar.startsWith("'") && scalar.endsWith("'"))
  ) {
    return scalar.slice(1, -1);
  }
  return scalar.replace(/\s+#.*$/, '').trim();
}

function parseInlineArray(value) {
  const scalar = value.trim();
  if (!scalar.startsWith('[') || !scalar.endsWith(']')) {
    return scalar ? [parseScalar(scalar)] : [];
  }

  return scalar
    .slice(1, -1)
    .split(',')
    .map(parseScalar)
    .filter(Boolean);
}

function parseFrontMatterFields(content) {
  const fields = {};
  for (const line of getFrontMatter(content).split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (match) {
      fields[match[1]] = match[2];
    }
  }
  return fields;
}

function parseYamlRecords(content) {
  const records = {};
  let currentRecord = null;

  for (const line of content.split(/\r?\n/)) {
    const recordMatch = line.match(/^([A-Za-z][\w-]*):\s*$/);
    if (recordMatch) {
      currentRecord = recordMatch[1];
      records[currentRecord] = {};
      continue;
    }

    const fieldMatch = line.match(/^\s{2}([A-Za-z][\w-]*):\s*(.*)$/);
    if (currentRecord && fieldMatch) {
      records[currentRecord][fieldMatch[1]] = parseScalar(fieldMatch[2]);
    }
  }

  return records;
}

function normalizeDate(sourcePath, frontMatterDate) {
  const filenameDate = path.posix.basename(sourcePath).match(/^(\d{4}-\d{2}-\d{2})-/)?.[1];
  const rawDate = frontMatterDate ? parseScalar(frontMatterDate) : filenameDate;
  if (!rawDate) {
    return '';
  }

  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`));
}

function getBlogExcerpt(content) {
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
  const beforeTruncate = body.split(/\{\/\*\s*truncate\s*\*\/\}/)[0];
  return beforeTruncate
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean)
    .slice(0, 2)
    .join('\n\n');
}

export function getBlogMarkdownPath(sourcePath, content) {
  const fields = parseFrontMatterFields(content);
  const slug = fields.slug
    ? parseScalar(fields.slug)
    : path.posix
        .basename(sourcePath)
        .replace(/\.mdx?$/i, '')
        .replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, '');
  const segments = normalizedSlug.split('/').filter((segment) => segment && segment !== '.');

  if (segments.length === 0 || segments.some((segment) => segment === '..')) {
    return null;
  }

  return `/blog/${segments.join('/')}.md`;
}

export function createBlogPost(sourcePath, content) {
  const fields = parseFrontMatterFields(content);
  const markdownPath = getBlogMarkdownPath(sourcePath, content);
  if (!markdownPath) {
    return null;
  }

  return {
    authors: parseInlineArray(fields.authors ?? ''),
    date: normalizeDate(sourcePath, fields.date),
    excerpt: getBlogExcerpt(content),
    markdownPath,
    slug: markdownPath.replace(/\.md$/, ''),
    tags: parseInlineArray(fields.tags ?? ''),
    title: fields.title ? parseScalar(fields.title) : markdownPath.split('/').at(-1).replace(/\.md$/, ''),
  };
}

function sortPosts(posts) {
  return [...posts].sort(
    (first, second) =>
      second.date.localeCompare(first.date) || first.title.localeCompare(second.title),
  );
}

function formatPostLink(post) {
  const date = formatDate(post.date);
  return `- [${post.title}](${post.slug})${date ? ` — ${date}` : ''}`;
}

function renderBlogIndex(posts) {
  const sections = sortPosts(posts).map((post) => {
    const metadata = [formatDate(post.date), post.authors.join(', ')]
      .filter(Boolean)
      .join(' · ');
    return [
      `## [${post.title}](${post.slug})`,
      metadata,
      post.excerpt,
    ].filter(Boolean).join('\n\n');
  });

  return ['# Blog', ...sections].join('\n\n');
}

function renderArchive(posts) {
  const byYear = new Map();
  for (const post of sortPosts(posts)) {
    const year = post.date.slice(0, 4) || 'Undated';
    if (!byYear.has(year)) {
      byYear.set(year, []);
    }
    byYear.get(year).push(post);
  }

  const sections = [...byYear.entries()].map(([year, yearPosts]) =>
    [`## ${year}`, ...yearPosts.map(formatPostLink)].join('\n'),
  );
  return ['# Blog Archive', ...sections].join('\n\n');
}

function renderAuthors(posts, authorMetadata) {
  const postIdsByAuthor = new Map();
  for (const post of sortPosts(posts)) {
    for (const authorId of post.authors) {
      if (!postIdsByAuthor.has(authorId)) {
        postIdsByAuthor.set(authorId, []);
      }
      postIdsByAuthor.get(authorId).push(post);
    }
  }

  const sections = [...postIdsByAuthor.entries()]
    .sort(([firstId], [secondId]) => {
      const firstName = authorMetadata[firstId]?.name ?? firstId;
      const secondName = authorMetadata[secondId]?.name ?? secondId;
      return firstName.localeCompare(secondName);
    })
    .map(([authorId, authorPosts]) => {
      const author = authorMetadata[authorId] ?? {};
      const description = author.title ? `_${author.title}_` : '';
      return [
        `## ${author.name ?? authorId}`,
        description,
        ...authorPosts.map(formatPostLink),
      ].filter(Boolean).join('\n\n');
    });

  return ['# Blog Authors', ...sections].join('\n\n');
}

function getTagRoute(tagId, tagMetadata) {
  const permalink = tagMetadata[tagId]?.permalink ?? `/${tagId}`;
  const slug = permalink.replace(/^\/+|\/+$/g, '');
  const segments = slug.split('/').filter((segment) => segment && segment !== '.');
  if (segments.length === 0 || segments.some((segment) => segment === '..')) {
    return null;
  }
  return `/blog/tags/${segments.join('/')}`;
}

function renderTagsIndex(posts, tagMetadata) {
  const tagIds = [...new Set(posts.flatMap((post) => post.tags))].sort();
  const entries = tagIds.map((tagId) => {
    const tag = tagMetadata[tagId] ?? {};
    const tagPosts = posts.filter((post) => post.tags.includes(tagId));
    const route = getTagRoute(tagId, tagMetadata);
    if (!route) {
      return '';
    }

    const label = tag.label ?? tagId;
    const description = tag.description ?? '';
    return `- [${label}](${route})${description ? ` — ${description}` : ''} (${tagPosts.length} posts)`;
  }).filter(Boolean);

  return ['# Blog Tags', ...entries].join('\n\n');
}

function renderTagPage(tagId, posts, tagMetadata) {
  const tag = tagMetadata[tagId] ?? {};
  const title = tag.label ?? tagId;
  const description = tag.description ?? '';
  const tagPosts = sortPosts(posts.filter((post) => post.tags.includes(tagId)));
  return [
    `# ${title}`,
    description,
    ...tagPosts.map(formatPostLink),
  ].filter(Boolean).join('\n\n');
}

export function createBlogIndexMarkdownPages(posts, authorsYaml = '', tagsYaml = '') {
  const sortedPosts = sortPosts(posts);
  const authorMetadata = parseYamlRecords(authorsYaml);
  const tagMetadata = parseYamlRecords(tagsYaml);
  const pages = {
    '/blog.md': renderBlogIndex(sortedPosts),
    '/blog/archive.md': renderArchive(sortedPosts),
    '/blog/authors.md': renderAuthors(sortedPosts, authorMetadata),
    '/blog/tags.md': renderTagsIndex(sortedPosts, tagMetadata),
  };

  const tagIds = [...new Set(sortedPosts.flatMap((post) => post.tags))];
  for (const tagId of tagIds) {
    const route = getTagRoute(tagId, tagMetadata);
    if (route) {
      pages[`${route}.md`] = renderTagPage(tagId, sortedPosts, tagMetadata);
    }
  }

  return pages;
}
