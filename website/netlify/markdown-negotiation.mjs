const MARKDOWN_MEDIA_TYPE = 'text/markdown';

export function acceptsMarkdown(acceptHeader = '') {
  return acceptHeader.split(',').some((mediaRange) => {
    const [mediaType, ...parameters] = mediaRange.split(';');
    if (mediaType.trim().toLowerCase() !== MARKDOWN_MEDIA_TYPE) {
      return false;
    }

    const qualityParameter = parameters.find((parameter) =>
      /^q\s*=/i.test(parameter.trim()),
    );
    if (!qualityParameter) {
      return true;
    }

    const normalizedQualityParameter = qualityParameter.trim();
    const quality = Number(
      normalizedQualityParameter.slice(normalizedQualityParameter.indexOf('=') + 1),
    );
    return Number.isFinite(quality) && quality > 0 && quality <= 1;
  });
}

export function getMarkdownCandidates(pathname) {
  if (pathname === '/docs' || pathname === '/docs/') {
    return ['/docs/intro.md'];
  }

  const normalizedPath = pathname.replace(/\/+$/, '');
  if (!normalizedPath || normalizedPath === '/') {
    return ['/index.md'];
  }

  return [`${normalizedPath}.md`, `${normalizedPath}/index.md`];
}

function appendVaryAccept(headers) {
  const vary = headers.get('vary');
  if (vary === '*') {
    return;
  }

  const values = (vary ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (!values.some((value) => value.toLowerCase() === 'accept')) {
    values.push('Accept');
  }
  headers.set('Vary', values.join(', '));
}

function withUpdatedHeaders(response, updateHeaders) {
  const headers = new Headers(response.headers);
  appendVaryAccept(headers);
  updateHeaders(headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isHtmlResponse(response) {
  return response.headers.get('content-type')?.toLowerCase().includes('text/html');
}

function shouldHandleRequest(request, pathname) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return false;
  }

  if (pathname.startsWith('/.netlify/') || pathname.startsWith('/.well-known/')) {
    return false;
  }

  const normalizedPath = pathname.replace(/\/+$/, '');
  const finalSegment = normalizedPath.split('/').at(-1);
  return !finalSegment?.includes('.');
}

export async function handleMarkdownNegotiation(request, context) {
  const url = new URL(request.url);
  if (!shouldHandleRequest(request, url.pathname)) {
    return;
  }

  const candidates = getMarkdownCandidates(url.pathname);
  if (acceptsMarkdown(request.headers.get('accept') ?? '')) {
    for (const candidate of candidates) {
      const markdownUrl = new URL(url);
      markdownUrl.pathname = candidate;

      const markdownResponse = await context.next(new Request(markdownUrl, request));
      if (markdownResponse.ok && !isHtmlResponse(markdownResponse)) {
        return withUpdatedHeaders(markdownResponse, (headers) => {
          headers.set('Content-Type', 'text/markdown; charset=utf-8');
        });
      }
    }
  }

  const htmlResponse = await context.next();
  return withUpdatedHeaders(htmlResponse, () => {});
}
