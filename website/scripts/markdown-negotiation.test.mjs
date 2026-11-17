import assert from 'node:assert/strict';
import test from 'node:test';
import {
  acceptsMarkdown,
  getMarkdownCandidates,
  handleMarkdownNegotiation,
} from '../netlify/markdown-negotiation.mjs';

test('accepts an explicit text/markdown preference', () => {
  assert.equal(acceptsMarkdown('text/markdown'), true);
  assert.equal(acceptsMarkdown('text/html, text/markdown;q=0.8'), true);
  assert.equal(acceptsMarkdown('TEXT/MARKDOWN; q=1'), true);
  assert.equal(acceptsMarkdown('text/markdown;q=0'), false);
  assert.equal(acceptsMarkdown('text/markdown;q=1.1'), false);
  assert.equal(acceptsMarkdown('text/html, */*'), false);
});

test('resolves root docs and category pages to generated Markdown paths', () => {
  assert.deepEqual(getMarkdownCandidates('/docs'), ['/docs/intro.md']);
  assert.deepEqual(getMarkdownCandidates('/docs/'), ['/docs/intro.md']);
  assert.deepEqual(getMarkdownCandidates('/docs/design/'), [
    '/docs/design.md',
    '/docs/design/index.md',
  ]);
  assert.deepEqual(getMarkdownCandidates('/whitepaper'), [
    '/whitepaper.md',
    '/whitepaper/index.md',
  ]);
  assert.deepEqual(getMarkdownCandidates('/blog/introducing-erc-8109-diamonds'), [
    '/blog/introducing-erc-8109-diamonds.md',
    '/blog/introducing-erc-8109-diamonds/index.md',
  ]);
  assert.deepEqual(getMarkdownCandidates('/blog'), [
    '/blog.md',
    '/blog/index.md',
  ]);
  assert.deepEqual(getMarkdownCandidates('/blog/tags/architecture'), [
    '/blog/tags/architecture.md',
    '/blog/tags/architecture/index.md',
  ]);
  assert.deepEqual(getMarkdownCandidates('/'), ['/index.md']);
});

test('serves the first available Markdown variant with the correct headers', async () => {
  const requestedPaths = [];
  const context = {
    async next(request) {
      const path = request ? new URL(request.url).pathname : '/docs/design/';
      requestedPaths.push(path);
      if (path === '/docs/design.md') {
        return new Response('Not found', { status: 404 });
      }
      if (path === '/docs/design/index.md') {
        return new Response('# Design', {
          headers: {
            'content-type': 'text/plain',
            'cache-control': 'public, max-age=60',
            vary: 'Accept-Encoding',
          },
        });
      }
      return new Response('<html>Design</html>', {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    },
  };
  const request = new Request('https://compose.diamonds/docs/design/?source=test', {
    headers: { accept: 'text/html, text/markdown' },
  });

  const response = await handleMarkdownNegotiation(request, context);

  assert.equal(await response.text(), '# Design');
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.equal(response.headers.get('vary'), 'Accept-Encoding, Accept');
  assert.equal(response.headers.get('cache-control'), 'public, max-age=60');
  assert.deepEqual(requestedPaths, [
    '/docs/design.md',
    '/docs/design/index.md',
  ]);
});

test('negotiates Markdown for a blog article route', async () => {
  const context = {
    async next(request) {
      assert.equal(
        new URL(request.url).pathname,
        '/blog/introducing-erc-8109-diamonds.md',
      );
      return new Response('# Introducing ERC-8109', {
        headers: { 'content-type': 'text/markdown' },
      });
    },
  };
  const response = await handleMarkdownNegotiation(
    new Request(
      'https://compose.diamonds/blog/introducing-erc-8109-diamonds',
      { headers: { accept: 'text/markdown' } },
    ),
    context,
  );

  assert.equal(await response.text(), '# Introducing ERC-8109');
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
});

test('serves the authored homepage Markdown at the root URL', async () => {
  const context = {
    async next(request) {
      assert.equal(new URL(request.url).pathname, '/index.md');
      return new Response('# Compose', {
        headers: { 'content-type': 'text/markdown' },
      });
    },
  };
  const response = await handleMarkdownNegotiation(
    new Request('https://compose.diamonds/', {
      headers: { accept: 'text/markdown' },
    }),
    context,
  );

  assert.equal(await response.text(), '# Compose');
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.equal(response.headers.get('vary'), 'Accept');
});

test('keeps HTML as the default and varies it by Accept', async () => {
  const context = {
    async next(request) {
      assert.equal(request, undefined);
      return new Response('<html>Docs</html>', {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    },
  };
  const response = await handleMarkdownNegotiation(
    new Request('https://compose.diamonds/docs/design/'),
    context,
  );

  assert.equal(await response.text(), '<html>Docs</html>');
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(response.headers.get('vary'), 'Accept');
});

test('falls back to HTML when no Markdown file exists', async () => {
  const context = {
    async next(request) {
      if (request) {
        return new Response('Not found', { status: 404 });
      }
      return new Response('<html>Blog</html>', {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    },
  };
  const response = await handleMarkdownNegotiation(
    new Request('https://compose.diamonds/blog/post/', {
      headers: { accept: 'text/markdown' },
    }),
    context,
  );

  assert.equal(await response.text(), '<html>Blog</html>');
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(response.headers.get('vary'), 'Accept');
});

test('does not intercept non-page resources or non-GET requests', async () => {
  const context = { next: () => assert.fail('request should bypass the function') };
  assert.equal(
    await handleMarkdownNegotiation(
      new Request('https://compose.diamonds/docs/design.md', {
        headers: { accept: 'text/markdown' },
      }),
      context,
    ),
    undefined,
  );
  assert.equal(
    await handleMarkdownNegotiation(
      new Request('https://compose.diamonds/docs/design/', { method: 'POST' }),
      context,
    ),
    undefined,
  );
});
