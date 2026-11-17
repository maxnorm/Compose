function transformOutsideFencedCode(content, transform) {
  const lines = content.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  let output = '';
  let markdown = '';
  let fence = null;

  for (const line of lines) {
    const fenceMatch = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/);
    if (!fence && fenceMatch) {
      output += transform(markdown);
      markdown = '';
      fence = {
        character: fenceMatch[1][0],
        length: fenceMatch[1].length,
      };
      output += line;
      continue;
    }

    if (fence) {
      output += line;
      const closeMatch = line.match(/^[ \t]{0,3}(`+|~+)[ \t]*\r?\n?$/);
      if (
        closeMatch &&
        closeMatch[1][0] === fence.character &&
        closeMatch[1].length >= fence.length
      ) {
        fence = null;
      }
      continue;
    }

    markdown += line;
  }

  return output + transform(markdown);
}

function getStringAttribute(attributes, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = attributes.match(
    new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*["']([^"']*)["']`),
  );
  return match?.[1];
}

function getBooleanAttribute(attributes, name, defaultValue) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = attributes.match(
    new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*\\{\\s*(true|false)\\s*\\}`),
  );
  return match ? match[1] === 'true' : defaultValue;
}

function getExpressionAttribute(attributes, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*\\{`).exec(attributes);
  if (!match) {
    return null;
  }

  const openBrace = match.index + match[0].lastIndexOf('{');
  const closeBrace = findMatchingDelimiter(attributes, openBrace, '{', '}');
  return closeBrace === -1 ? null : attributes.slice(openBrace + 1, closeBrace);
}

function skipQuotedString(content, start) {
  const quote = content[start];
  for (let index = start + 1; index < content.length; index += 1) {
    if (content[index] === '\\') {
      index += 1;
    } else if (content[index] === quote) {
      return index + 1;
    }
  }
  return content.length;
}

function findMatchingDelimiter(content, start, opening, closing) {
  let depth = 0;
  for (let index = start; index < content.length; index += 1) {
    const character = content[index];
    if (character === '"' || character === "'" || character === '`') {
      index = skipQuotedString(content, index) - 1;
    } else if (character === opening) {
      depth += 1;
    } else if (character === closing) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }
  return -1;
}

function readExpressionValue(content, start) {
  const closingFor = { '{': '}', '[': ']', '(': ')' };
  const stack = [];
  const jsxStack = [];

  for (let index = start; index < content.length; index += 1) {
    const character = content[index];
    if (character === '"' || character === "'" || character === '`') {
      index = skipQuotedString(content, index) - 1;
    } else if (character === '<') {
      const tag = parseJsxTag(content, index);
      if (tag) {
        if (tag.closing) {
          if (jsxStack.length > 0) {
            jsxStack.pop();
          }
        } else if (!tag.selfClosing && !tag.fragment) {
          jsxStack.push(tag.name);
        } else if (tag.fragment && !tag.closing) {
          jsxStack.push('');
        }
        index = tag.end;
      }
    } else if (closingFor[character]) {
      stack.push(closingFor[character]);
    } else if (character === ',' && stack.length === 0 && jsxStack.length === 0) {
      return content.slice(start, index).trim();
    } else if (character === '}' || character === ']' || character === ')') {
      if (stack.length === 0) {
        if (character === '}' && jsxStack.length > 0) {
          continue;
        }
        return content.slice(start, index).trim();
      }
      if (stack.pop() !== character) {
        return content.slice(start, index).trim();
      }
    }
  }

  return content.slice(start).trim();
}

function parseJsxTag(content, start) {
  const match = content.slice(start).match(/^<(\/?)([A-Za-z][A-Za-z0-9.-]*)?/);
  const fragment = content.startsWith('<>', start) || content.startsWith('</>', start);
  if (!fragment && (!match || !/[\s/>]/.test(content[start + match[0].length] ?? ''))) {
    return null;
  }

  const end = findTagEnd(content, start);
  if (end === -1) {
    return null;
  }

  const rawTag = content.slice(start, end);
  return {
    name: match?.[2] ?? '',
    closing: content.startsWith('</', start),
    end,
    fragment,
    selfClosing: !fragment && /\/\s*$/.test(rawTag),
  };
}

function getObjectPropertyValue(objectSource, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const property = new RegExp(`(?:^|[{,])\\s*${escapedName}\\s*:\\s*`).exec(objectSource);
  if (!property) {
    return null;
  }

  return readExpressionValue(objectSource, property.index + property[0].length);
}

function parseObjectArray(expression) {
  const source = expression?.trim();
  if (!source?.startsWith('[')) {
    return [];
  }

  const objects = [];
  for (let index = 1; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"' || character === "'" || character === '`') {
      index = skipQuotedString(source, index) - 1;
    } else if (character === ']') {
      break;
    } else if (character === '{') {
      const end = findMatchingDelimiter(source, index, '{', '}');
      if (end === -1) {
        return [];
      }
      objects.push(source.slice(index, end + 1));
      index = end;
    }
  }

  return objects;
}

function parseLiteral(source) {
  const value = source?.trim();
  if (!value) {
    return null;
  }
  if (value[0] === '"' || value[0] === "'" || value[0] === '`') {
    const end = skipQuotedString(value, 0);
    if (end === value.length) {
      return value.slice(1, -1).replace(/\\(['"`\\])/g, '$1');
    }
  }
  if (/^(?:true|false|null|-?\d+(?:\.\d+)?n?)$/.test(value)) {
    return value;
  }
  return value;
}

function jsxToMarkdown(source) {
  let text = source.trim();
  if (text.startsWith('(') && text.endsWith(')')) {
    text = text.slice(1, -1).trim();
  }

  text = text
    .replace(/<>|<\/>/g, '')
    .replace(/\{\s*(['"])\s*\1\s*\}/g, ' ')
    .replace(/\{\s*(['"])([\s\S]*?)\1\s*\}/g, '$2')
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/g, '`$1`')
    .replace(
      /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/g,
      '[$2]($1)',
    )
    .replace(/<\/?[A-Za-z][^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

function getPropertyDescription(property) {
  const element = getObjectPropertyValue(property, 'descriptionElement');
  const description = element
    ? jsxToMarkdown(element)
    : parseLiteral(
        getObjectPropertyValue(property, 'description') ??
          getObjectPropertyValue(property, 'desc'),
      );
  const details = description ? [description] : [];

  for (const name of ['default', 'example']) {
    const value = getObjectPropertyValue(property, name);
    if (value !== null) {
      const label = name === 'default' ? 'Default' : 'Example';
      details.push(`${label}: \`${parseLiteral(value)}\``);
    }
  }

  return details.join(' ');
}

function markdownTableCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
}

function convertPropertyTable(attributes, propertyName = 'properties', columnName = 'Property') {
  const properties = parseObjectArray(getExpressionAttribute(attributes, propertyName));
  if (properties.length === 0) {
    return '';
  }

  const showTypes = getBooleanAttribute(attributes, 'showTypes', true);
  const showRequired = getBooleanAttribute(attributes, 'showRequired', true);
  const title = getStringAttribute(attributes, 'title');
  const columns = [columnName];
  if (showTypes) {
    columns.push('Type');
  }
  if (showRequired) {
    columns.push('Required');
  }
  columns.push('Description');

  const rows = properties.map((property) => {
    const name = parseLiteral(getObjectPropertyValue(property, 'name')) ?? '';
    const type = parseLiteral(getObjectPropertyValue(property, 'type')) ?? 'any';
    const required = getObjectPropertyValue(property, 'required')?.trim() === 'true';
    const row = [`\`${markdownTableCell(name)}\``];
    if (showTypes) {
      row.push(`\`${markdownTableCell(type)}\``);
    }
    if (showRequired) {
      row.push(required ? 'Yes' : 'No');
    }
    row.push(markdownTableCell(getPropertyDescription(property) || '-'));
    return `| ${row.join(' | ')} |`;
  });

  const heading = title ? `**${title}**\n\n` : '';
  const header = `| ${columns.join(' | ')} |`;
  const separator = `| ${columns.map(() => '---').join(' | ')} |`;
  return `${heading}${header}\n${separator}\n${rows.join('\n')}`;
}

function convertParameterTables(content) {
  return replaceComponentElements(content, 'ParameterTable', (attributes) =>
    convertPropertyTable(attributes, 'parameters', 'Parameter'),
  );
}

function replaceComponentElements(content, componentName, render) {
  const pattern = new RegExp(`<${componentName}\\b`, 'g');
  let result = '';
  let cursor = 0;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const tag = parseComponentTag(content, match.index);
    if (!tag) {
      continue;
    }

    let body = '';
    let end = tag.end + 1;
    if (!tag.selfClosing) {
      const closingTag = `</${componentName}>`;
      const closingIndex = content.indexOf(closingTag, end);
      if (closingIndex === -1) {
        continue;
      }
      body = content.slice(end, closingIndex);
      end = closingIndex + closingTag.length;
    }

    result += content.slice(cursor, match.index) + render(tag.attributes, body);
    cursor = end;
    pattern.lastIndex = end;
  }

  return result + content.slice(cursor);
}

function findTagEnd(content, start) {
  let quote = null;
  let braceDepth = 0;

  for (let index = start + 1; index < content.length; index += 1) {
    const character = content[index];
    if (quote) {
      if (character === '\\') {
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '{') {
      braceDepth += 1;
    } else if (character === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
    } else if (character === '>' && braceDepth === 0) {
      return index;
    }
  }

  return -1;
}

function parseComponentTag(content, start) {
  const opening = content.slice(start).match(/^<\/?([A-Z][A-Za-z0-9]*)\b/);
  if (!opening) {
    return null;
  }

  const end = findTagEnd(content, start);
  if (end === -1) {
    return null;
  }

  const name = opening[1];
  const attributesStart = start + opening[0].length;
  const rawAttributes = content.slice(attributesStart, end);
  return {
    name,
    end,
    attributes: rawAttributes.replace(/\/\s*$/, ''),
    selfClosing: /\/\s*$/.test(rawAttributes),
  };
}

function getComponentItems(content, componentName) {
  const items = [];
  const componentPattern = new RegExp(`<${componentName}\\b`, 'g');
  let match;

  while ((match = componentPattern.exec(content)) !== null) {
    const tag = parseComponentTag(content, match.index);
    if (!tag) {
      continue;
    }

    let body = '';
    let end = tag.end + 1;
    if (!tag.selfClosing) {
      const closingTag = `</${componentName}>`;
      const closingIndex = content.indexOf(closingTag, end);
      if (closingIndex !== -1) {
        body = content.slice(end, closingIndex).trim();
        end = closingIndex + closingTag.length;
      }
    }

    items.push({
      attributes: tag.attributes,
      body,
    });
    componentPattern.lastIndex = end;
  }

  return items;
}

function renderGridItems(content, gridName, itemName, formatItem) {
  const gridPattern = new RegExp(
    `<${gridName}\\b[^>]*>([\\s\\S]*?)<\\/${gridName}>`,
    'g',
  );

  return content.replace(gridPattern, (fullMatch, gridContent) => {
    const items = getComponentItems(gridContent, itemName)
      .map(formatItem)
      .filter(Boolean);
    return items.length > 0 ? `\n${items.join('\n')}\n` : gridContent;
  });
}

function convertFeatureGrids(content) {
  return renderGridItems(
    content,
    'FeatureGrid',
    'FeatureGridItem',
    ({ attributes, body }) => {
      const title = getStringAttribute(attributes, 'title');
      const description = getStringAttribute(attributes, 'description');
      const href = getStringAttribute(attributes, 'href');
      if (!title && !description && !body) {
        return '';
      }

      const label = title
        ? href
          ? `[${title}](${href})`
          : `**${title}**`
        : '';
      const details = [description, body].filter(Boolean).join(' ');
      return `- ${[label, details].filter(Boolean).join(': ')}`;
    },
  );
}

function convertContributionCards(content) {
  return renderGridItems(
    content,
    'ContributionCardGrid',
    'ContributionCard',
    ({ attributes, body }) => {
      const title = getStringAttribute(attributes, 'title');
      const description = getStringAttribute(attributes, 'description');
      const href = getStringAttribute(attributes, 'href');
      const kicker = getStringAttribute(attributes, 'kicker');
      if (!title && !description && !body) {
        return '';
      }

      const label = title
        ? href
          ? `[${title}](${href})`
          : `**${title}**`
        : '';
      const details = [kicker, description, body].filter(Boolean).join(' — ');
      return `- ${[label, details].filter(Boolean).join(': ')}`;
    },
  );
}

function makeCodeFence(code) {
  const longestBacktickRun = Math.max(
    0,
    ...[...code.matchAll(/`+/g)].map(([run]) => run.length),
  );
  return '`'.repeat(Math.max(3, longestBacktickRun + 1));
}

function convertExpandableCode(content) {
  return content.replace(
    /<ExpandableCode\b([^>]*)>([\s\S]*?)<\/ExpandableCode>/g,
    (_match, attributes, children) => {
      const trimmedChildren = children.trim();
      const templateLiteral = trimmedChildren.match(/^\{`([\s\S]*)`\}$/);
      const expression = trimmedChildren.match(/^\{([\s\S]*)\}$/);
      const code = (templateLiteral?.[1] ?? expression?.[1] ?? trimmedChildren)
        .replace(/\\`/g, '`')
        .trim();
      const language = getStringAttribute(attributes, 'language') ?? '';
      const title = getStringAttribute(attributes, 'title');
      const fence = makeCodeFence(code);
      const heading = title ? `**${title}**\n\n` : '';
      return `${heading}${fence}${language}\n${code}\n${fence}`;
    },
  );
}

function convertPropertyTables(content) {
  return replaceComponentElements(content, 'PropertyTable', (attributes) =>
    convertPropertyTable(attributes),
  );
}

function convertStepIndicators(content) {
  return replaceComponentElements(content, 'StepIndicator', (attributes) => {
    const steps = parseObjectArray(getExpressionAttribute(attributes, 'steps'));
    return steps
      .map((step, index) => {
        const title = parseLiteral(getObjectPropertyValue(step, 'title')) ?? '';
        const rawDescription = getObjectPropertyValue(step, 'description');
        const description = rawDescription
          ? rawDescription.trim().startsWith('<') ||
            rawDescription.trim().startsWith('(')
            ? jsxToMarkdown(rawDescription)
            : parseLiteral(rawDescription)
          : '';
        const label = title ? `**${title}**` : `Step ${index + 1}`;
        return `${index + 1}. ${label}${description ? ` — ${description}` : ''}`;
      })
      .join('\n');
  });
}

function convertTerminalCommands(content) {
  return replaceComponentElements(content, 'TerminalCommand', (attributes) => {
    const command = getStringAttribute(attributes, 'command');
    if (!command) {
      return '';
    }

    const prompt = getStringAttribute(attributes, 'prompt') ?? '$';
    const language = getStringAttribute(attributes, 'language') ?? 'bash';
    const fence = makeCodeFence(command);
    const commandLine = prompt ? `${prompt} ${command}` : command;
    return `${fence}${language}\n${commandLine}\n${fence}`;
  });
}

function convertApiEndpoints(content) {
  return replaceComponentElements(content, 'ApiEndpoint', (attributes) => {
    const method = getStringAttribute(attributes, 'method') ?? 'GET';
    const path = getStringAttribute(attributes, 'path') ?? '';
    const description = getStringAttribute(attributes, 'description');
    const params = parseObjectArray(getExpressionAttribute(attributes, 'params'));
    const lines = [`**${method.toUpperCase()}** \`${path}\`${description ? ` — ${description}` : ''}`];

    if (params.length > 0) {
      lines.push('', 'Parameters:');
      for (const param of params) {
        const name = parseLiteral(getObjectPropertyValue(param, 'name')) ?? '';
        const required = getObjectPropertyValue(param, 'required')?.trim() === 'true';
        const detail = parseLiteral(
          getObjectPropertyValue(param, 'description') ??
            getObjectPropertyValue(param, 'desc'),
        );
        lines.push(
          `- \`${name}\`${required ? ' (required)' : ''}${detail ? ` — ${detail}` : ''}`,
        );
      }
    }

    return lines.join('\n');
  });
}

function convertCodeShowcases(content) {
  return replaceComponentElements(content, 'CodeShowcase', (attributes) => {
    const examples = parseObjectArray(getExpressionAttribute(attributes, 'examples'));
    const title = getStringAttribute(attributes, 'title');
    const description = getStringAttribute(attributes, 'description');
    const sections = examples.map((example) => {
      const label = parseLiteral(getObjectPropertyValue(example, 'label'));
      const language = parseLiteral(getObjectPropertyValue(example, 'language')) ?? 'javascript';
      const code = parseLiteral(getObjectPropertyValue(example, 'code')) ?? '';
      const heading = label ? `**${label}**\n\n` : '';
      const fence = makeCodeFence(code);
      return `${heading}${fence}${language}\n${code}\n${fence}`;
    });

    return [
      title ? `**${title}**` : '',
      description ?? '',
      ...sections,
    ].filter(Boolean).join('\n\n');
  });
}

function convertRelatedDocs(content) {
  return replaceComponentElements(content, 'RelatedDocs', (attributes) => {
    const items = parseObjectArray(getExpressionAttribute(attributes, 'items'));
    const title = getStringAttribute(attributes, 'title') ?? 'Related Documentation';
    const links = items.map((item) => {
      const itemTitle = parseLiteral(getObjectPropertyValue(item, 'title')) ?? '';
      const href = parseLiteral(getObjectPropertyValue(item, 'href')) ?? '';
      const description = parseLiteral(getObjectPropertyValue(item, 'description'));
      const label = href ? `[${itemTitle}](${href})` : itemTitle;
      return `- ${label}${description ? ` — ${description}` : ''}`;
    });

    return links.length > 0 ? `**${title}**\n\n${links.join('\n')}` : '';
  });
}

function convertFeatureCards(content) {
  return replaceComponentElements(content, 'FeatureCard', (attributes) => {
    const title = getStringAttribute(attributes, 'title') ?? '';
    const description = getStringAttribute(attributes, 'description');
    const link = getStringAttribute(attributes, 'link');
    const label = link ? `[${title}](${link})` : `**${title}**`;
    return `- ${label}${description ? ` — ${description}` : ''}`;
  });
}

function convertMetricCards(content) {
  return replaceComponentElements(content, 'MetricCard', (attributes) => {
    const value = getStringAttribute(attributes, 'value') ?? '';
    const label = getStringAttribute(attributes, 'label') ?? '';
    const trendSource = getExpressionAttribute(attributes, 'trend');
    const direction = trendSource
      ? parseLiteral(getObjectPropertyValue(trendSource, 'direction'))
      : null;
    const trendValue = trendSource
      ? parseLiteral(getObjectPropertyValue(trendSource, 'value'))
      : null;
    const trend = direction && trendValue ? ` (${direction} ${trendValue})` : '';
    return `- **${value}** — ${label}${trend}`;
  });
}

function convertAnimatedCounters(content) {
  return replaceComponentElements(content, 'AnimatedCounter', (attributes) => {
    const endSource = getExpressionAttribute(attributes, 'end');
    const end = parseLiteral(endSource) ?? getStringAttribute(attributes, 'end');
    if (end === null || end === undefined) {
      return '';
    }

    const prefix = getStringAttribute(attributes, 'prefix') ?? '';
    const suffix = getStringAttribute(attributes, 'suffix') ?? '';
    const separator = getStringAttribute(attributes, 'separator') ?? ',';
    const decimals = Number(
      parseLiteral(getExpressionAttribute(attributes, 'decimals')) ?? 0,
    );
    const number = Number(String(end).replace(/,/g, ''));
    let formatted = String(end);
    if (Number.isFinite(number)) {
      const fixed = number.toFixed(Number.isInteger(decimals) && decimals >= 0 ? decimals : 0);
      const parts = fixed.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      formatted = parts.join('.');
    }
    return `**${prefix}${formatted}${suffix}**`;
  });
}

function convertGradientButtons(content) {
  return replaceComponentElements(content, 'GradientButton', (attributes, body) => {
    const label = jsxToMarkdown(body);
    const destination =
      getStringAttribute(attributes, 'to') ?? getStringAttribute(attributes, 'href');
    return destination ? `[${label}](${destination})` : label;
  });
}

function convertDocHeroes(content) {
  return replaceComponentElements(content, 'DocHero', (attributes, body) => {
    const title = getStringAttribute(attributes, 'title');
    const subtitle = getStringAttribute(attributes, 'subtitle');
    const cleanedBody = jsxToMarkdown(convertGradientButtons(body));
    return [title ? `**${title}**` : '', subtitle, cleanedBody]
      .filter(Boolean)
      .join('\n\n');
  });
}

function getPackageImport(gitSource) {
  const marker = '/tree/main/src/';
  const markerIndex = gitSource?.indexOf(marker) ?? -1;
  if (markerIndex === -1) {
    return '';
  }

  const relativePath = gitSource.slice(markerIndex + marker.length);
  return relativePath ? `\`@perfect-abstractions/compose/${relativePath}\`` : '';
}

function convertPackageImports(content, gitSource) {
  return replaceComponentElements(content, 'PackageImport', () =>
    getPackageImport(gitSource),
  );
}

function convertCallouts(content) {
  return content.replace(
    /<(Callout|CalloutBox)\b([^>]*)>([\s\S]*?)<\/\1>/g,
    (_match, _component, attributes, body) => {
      const title = getStringAttribute(attributes, 'title');
      const type = getStringAttribute(attributes, 'type');
      const label = title ?? (type ? type[0].toUpperCase() + type.slice(1) : 'Note');
      const lines = body.trim().split('\n');
      const quotedBody = lines
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n');
      return `> **${label}**\n>\n${quotedBody}`.trimEnd();
    },
  );
}

function convertAccordions(content) {
  return content.replace(
    /<Accordion\b([^>]*)>([\s\S]*?)<\/Accordion>/g,
    (_match, attributes, body) => {
      const title = getStringAttribute(attributes, 'title');
      const heading = title ? `**${title}**\n\n` : '';
      return `${heading}${body.trim()}`;
    },
  );
}

function stripComponentTags(content) {
  let output = '';
  let cursor = 0;

  while (cursor < content.length) {
    const start = content.indexOf('<', cursor);
    if (start === -1) {
      output += content.slice(cursor);
      break;
    }

    const isFragment = content.startsWith('<>', start) || content.startsWith('</>', start);
    const tag = isFragment ? null : parseComponentTag(content, start);
    if (isFragment) {
      output += content.slice(cursor, start);
      cursor = start + (content.startsWith('</>', start) ? 3 : 2);
    } else if (tag) {
      output += content.slice(cursor, start);
      cursor = tag.end + 1;
    } else {
      output += content.slice(cursor, start + 1);
      cursor = start + 1;
    }
  }

  return output;
}

function convertComponentsOutsideCode(content, options) {
  content = convertExpandableCode(content);
  content = convertPropertyTables(content);
  content = convertParameterTables(content);
  content = convertStepIndicators(content);
  content = convertTerminalCommands(content);
  content = convertApiEndpoints(content);
  content = convertCodeShowcases(content);
  content = convertRelatedDocs(content);
  content = convertFeatureCards(content);
  content = convertMetricCards(content);
  content = convertAnimatedCounters(content);
  content = convertGradientButtons(content);
  content = convertDocHeroes(content);
  content = convertPackageImports(content, options.gitSource);
  content = convertFeatureGrids(content);
  content = convertContributionCards(content);
  content = convertCallouts(content);
  content = convertAccordions(content);
  return transformOutsideFencedCode(content, stripComponentTags);
}

export function convertMdxComponentsToMarkdown(content, options = {}) {
  return transformOutsideFencedCode(content, (markdown) =>
    convertComponentsOutsideCode(markdown, options),
  );
}

export { transformOutsideFencedCode };
