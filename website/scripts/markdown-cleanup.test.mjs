import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { convertMdxComponentsToMarkdown } from '../plugins/mdx-components-to-markdown.mjs';
import {
  createBlogIndexMarkdownPages,
  createBlogPost,
  getBlogMarkdownPath,
} from '../plugins/blog-markdown.mjs';

test('preserves text inside callouts and subtitle components', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<DocSubtitle>
An important summary.
</DocSubtitle>

<Callout type="note" title="In Simple Terms">
A diamond contract is made from facets.
</Callout>
`);

  assert.match(markdown, /An important summary\./);
  assert.match(markdown, /\*\*In Simple Terms\*\*/);
  assert.match(markdown, /A diamond contract is made from facets\./);
  assert.doesNotMatch(markdown, /<\/?(?:DocSubtitle|Callout)\b/);
});

test('renders ExpandableCode bodies as fenced code blocks', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<ExpandableCode language="solidity" title="Owner module">
{\`pragma solidity >=0.8.30;

function owner() internal view returns (address) {}
\`}
</ExpandableCode>
`);

  assert.match(markdown, /\*\*Owner module\*\*/);
  assert.match(markdown, /```solidity\npragma solidity >=0\.8\.30;/);
  assert.match(markdown, /function owner\(\) internal view returns \(address\) \{\}/);
  assert.doesNotMatch(markdown, /ExpandableCode|^\s*\{\s*`/m);
});

test('renders prop-based feature and contribution cards as Markdown lists', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<FeatureGrid columns={2}>
  <FeatureGridItem
    icon={<Icon name="lightning" size={32} />}
    title="Composable"
    description="Assemble focused facets."
    href="/docs/design"
  />
</FeatureGrid>

<ContributionCardGrid columns={2}>
  <ContributionCard
    kicker="Solidity"
    title="Library Development"
    description="Extend the contract library."
    href="/docs/contribution/library/development"
  />
</ContributionCardGrid>
`);

  assert.match(
    markdown,
    /- \[Composable\]\(\/docs\/design\): Assemble focused facets\./,
  );
  assert.match(
    markdown,
    /- \[Library Development\]\(\/docs\/contribution\/library\/development\): Solidity — Extend the contract library\./,
  );
  assert.doesNotMatch(
    markdown,
    /<\/?(?:FeatureGrid|FeatureGridItem|ContributionCardGrid|ContributionCard)\b/,
  );
});

test('preserves generic component children and accordion titles', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<AccordionGroup>
  <Accordion title="No inheritance">
    Compose uses composition instead of inheritance.
  </Accordion>
</AccordionGroup>
`);

  assert.match(markdown, /\*\*No inheritance\*\*/);
  assert.match(markdown, /Compose uses composition instead of inheritance\./);
  assert.doesNotMatch(markdown, /<\/?(?:AccordionGroup|Accordion)\b/);
});

test('does not rewrite literal JSX examples inside fenced code blocks', () => {
  const source = [
    '```mdx',
    '<Callout title="Example">',
    'This is literal example content.',
    '</Callout>',
    '```',
  ].join('\n');

  assert.equal(convertMdxComponentsToMarkdown(source), source);
});

test('converts PropertyTable props and descriptions to a Markdown table', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<PropertyTable
  properties={[
    {
      name: "_facets",
      type: "address[]",
      descriptionElement: (
        <>
          The facets must implement{" "}
          <a href="https://example.com/IFacet"><code>IFacet</code></a>.
        </>
      )
    },
    {
      name: "_delegate",
      type: "address",
      description: "Optional contract",
      required: true,
      default: "address(0)"
    }
  ]}
  showRequired={false}
/>
`);

  assert.match(markdown, /\| Property \| Type \| Description \|/);
  assert.match(
    markdown,
    /\| `_facets` \| `address\[\]` \| The facets must implement \[`IFacet`\]\(https:\/\/example\.com\/IFacet\)\. \|/,
  );
  assert.match(markdown, /\| `_delegate` \| `address` \| Optional contract Default: `address\(0\)` \|/);
  assert.doesNotMatch(markdown, /<PropertyTable\b|showRequired/);
});

test('renders StepIndicator steps, including JSX descriptions', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<StepIndicator
  steps={[
    { title: 'Import selectors', description: <>Query <code>exportSelectors()</code>, once per facet.</> },
    { title: 'Emit event', description: 'Emit one event per facet.' }
  ]}
/>
`);

  assert.match(markdown, /1\. \*\*Import selectors\*\* — Query `exportSelectors\(\)`, once per facet\./);
  assert.match(markdown, /2\. \*\*Emit event\*\* — Emit one event per facet\./);
  assert.doesNotMatch(markdown, /<StepIndicator\b|steps=/);
});

test('renders TerminalCommand and PackageImport component values', () => {
  const markdown = convertMdxComponentsToMarkdown(
    `
<TerminalCommand command="npm install package-name" />

<PackageImport/>
`,
    {
      gitSource:
        'https://github.com/Perfect-Abstractions/Compose/tree/main/src/token/ERC20/Transfer/ERC20TransferMod.sol',
    },
  );

  assert.match(markdown, /```bash\n\$ npm install package-name\n```/);
  assert.match(markdown, /`@perfect-abstractions\/compose\/token\/ERC20\/Transfer\/ERC20TransferMod\.sol`/);
  assert.doesNotMatch(markdown, /<TerminalCommand\b|<PackageImport\b/);
});

test('converts prop-based components from an existing library reference page', async () => {
  const source = await readFile(
    new URL('../docs/library/diamond/DiamondUpgradeMod.mdx', import.meta.url),
    'utf8',
  );
  const markdown = convertMdxComponentsToMarkdown(source);

  assert.match(
    markdown,
    /\| `_addFacets` \| `address\[\]` \| Facet addresses to add \|/,
  );
  assert.match(
    markdown,
    /1\. \*\*Import selectors\*\* — Each facet in `_facets` is queried via `exportSelectors\(\)`\./,
  );
  assert.doesNotMatch(markdown, /<PropertyTable\b|<StepIndicator\b/);
});

test('renders API endpoints and parameter tables as Markdown', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<ApiEndpoint
  method="GET"
  path="/api/v1/users/{id}"
  description="Retrieve a user"
  params={[
    { name: "id", required: true, description: "User identifier" },
    { name: "include", required: false, description: "Related resources" }
  ]}
/>

<ParameterTable
  title="Path Parameters"
  parameters={[
    { name: "id", type: "string", required: true, description: "Unique user ID" }
  ]}
/>
`);

  assert.match(markdown, /\*\*GET\*\* `\/api\/v1\/users\/\{id\}` — Retrieve a user/);
  assert.match(markdown, /- `id` \(required\) — User identifier/);
  assert.match(markdown, /\*\*Path Parameters\*\*/);
  assert.match(markdown, /\| Parameter \| Type \| Required \| Description \|/);
  assert.match(markdown, /\| `id` \| `string` \| Yes \| Unique user ID \|/);
  assert.doesNotMatch(markdown, /<(?:ApiEndpoint|ParameterTable)\b/);
});

test('keeps all CodeShowcase language examples', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<CodeShowcase
  title="Authentication Example"
  description="Authenticate API requests"
  examples={[
    { label: 'JavaScript', language: 'javascript', code: 'const token = "abc";' },
    { label: 'cURL', language: 'bash', code: 'curl https://example.com' }
  ]}
/>
`);

  assert.match(markdown, /\*\*Authentication Example\*\*/);
  assert.match(markdown, /Authenticate API requests/);
  assert.match(markdown, /\*\*JavaScript\*\*\n\n```javascript\nconst token = "abc";/);
  assert.match(markdown, /\*\*cURL\*\*\n\n```bash\ncurl https:\/\/example\.com/);
  assert.doesNotMatch(markdown, /<CodeShowcase\b|examples=/);
});

test('preserves RelatedDocs and card data as linked Markdown lists', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<RelatedDocs
  title="Related Topics"
  items={[
    { title: 'Advanced Patterns', href: '/docs/advanced', description: 'Go deeper' }
  ]}
/>

<FeatureCard
  title="Reusable facets"
  description="Build from focused components."
  link="/docs/facets"
/>
`);

  assert.match(markdown, /\*\*Related Topics\*\*/);
  assert.match(markdown, /- \[Advanced Patterns\]\(\/docs\/advanced\) — Go deeper/);
  assert.match(markdown, /- \[Reusable facets\]\(\/docs\/facets\) — Build from focused components\./);
  assert.doesNotMatch(markdown, /<(?:RelatedDocs|FeatureCard)\b/);
});

test('preserves metrics, counters, DocHero copy, and button destinations', () => {
  const markdown = convertMdxComponentsToMarkdown(`
<MetricCard value="1,234" label="Active Users" trend={{ direction: 'up', value: '12%' }} />
<AnimatedCounter end={99.99} prefix="$" decimals={2} />

<DocHero title="Get Started" subtitle="Choose your path">
  <div>
    <GradientButton to="/docs/quickstart">Quick Start</GradientButton>
  </div>
</DocHero>
`);

  assert.match(markdown, /- \*\*1,234\*\* — Active Users \(up 12%\)/);
  assert.match(markdown, /\*\*\$99\.99\*\*/);
  assert.match(markdown, /\*\*Get Started\*\*/);
  assert.match(markdown, /Choose your path/);
  assert.match(markdown, /\[Quick Start\]\(\/docs\/quickstart\)/);
  assert.doesNotMatch(markdown, /<(?:MetricCard|AnimatedCounter|DocHero|GradientButton)\b/);
});

test('preserves the P1 component examples in the component reference page', async () => {
  const source = await readFile(
    new URL('../docs/contribution/documentation/all-components.mdx', import.meta.url),
    'utf8',
  );
  const markdown = convertMdxComponentsToMarkdown(source);

  assert.match(markdown, /\*\*GET\*\* `\/api\/v1\/users\/\{id\}` — Retrieve a specific user by ID/);
  assert.match(markdown, /\| `userId` \| `string` \| Yes \| The ID of the user to retrieve \|/);
  assert.match(markdown, /curl -X GET https:\/\/api\.example\.com\/auth/);
  assert.match(markdown, /\[System Design Guide\]\(\/docs\/contribution\/documentation\/system-design-guide\)/);
  assert.match(markdown, /\*\*Precise Targeting\*\* — Target your audience with laser precision/);
  assert.match(markdown, /\*\*1,234\*\* — Active Users \(up 12%\)/);
  assert.match(markdown, /\*\*\$99\.99\*\*/);
  assert.match(markdown, /\*\*API Documentation\*\*/);
  assert.match(markdown, /\[Get Started\]\(\/docs\/\)/);
});

test('maps dated blog source files to their published slug Markdown URLs', async () => {
  const currentPosts = [
    ['2025-10-28-welcome.md', '/blog/2025-10-28-welcome.md'],
    [
      '2025-12-30-diamond-architectural-metaphors.md',
      '/blog/diamond-architecture-metaphors.md',
    ],
    [
      '2025-12-31-introducing-erc-8109-diamonds.md',
      '/blog/introducing-erc-8109-diamonds.md',
    ],
  ];
  for (const [file, expectedPath] of currentPosts) {
    const content = await readFile(new URL(`../blog/${file}`, import.meta.url), 'utf8');
    assert.equal(getBlogMarkdownPath(file, content), expectedPath);
  }

  assert.equal(
    getBlogMarkdownPath(
      '2025-10-28-welcome.md',
      '---\nslug: 2025-10-28-welcome\ntitle: Welcome\n---\nPost body',
    ),
    '/blog/2025-10-28-welcome.md',
  );
  assert.equal(
    getBlogMarkdownPath(
      '2025-12-31-introducing-erc-8109-diamonds.md',
      '---\nslug: introducing-erc-8109-diamonds\ntitle: ERC-8109\n---\nPost body',
    ),
    '/blog/introducing-erc-8109-diamonds.md',
  );
  assert.equal(
    getBlogMarkdownPath('2026-02-01-default-slug.mdx', '---\ntitle: Post\n---\nBody'),
    '/blog/default-slug.md',
  );
});

test('generates Markdown for blog listings, archive, authors, and tag routes', async () => {
  const blogFiles = [
    '2025-10-28-welcome.md',
    '2025-12-30-diamond-architectural-metaphors.md',
    '2025-12-31-introducing-erc-8109-diamonds.md',
  ];
  const posts = [];
  for (const file of blogFiles) {
    const content = await readFile(new URL(`../blog/${file}`, import.meta.url), 'utf8');
    posts.push(createBlogPost(file, content));
  }
  const authorsYaml = await readFile(new URL('../blog/authors.yml', import.meta.url), 'utf8');
  const tagsYaml = await readFile(new URL('../blog/tags.yml', import.meta.url), 'utf8');

  const pages = createBlogIndexMarkdownPages(posts, authorsYaml, tagsYaml);

  assert.deepEqual(
    Object.keys(pages).sort(),
    [
      '/blog.md',
      '/blog/archive.md',
      '/blog/authors.md',
      '/blog/tags.md',
      '/blog/tags/architecture.md',
      '/blog/tags/hello.md',
      '/blog/tags/standards.md',
    ].sort(),
  );
  assert.ok(pages['/blog.md'].indexOf('Introducing ERC-8109') < pages['/blog.md'].indexOf('Diamond Architecture Metaphors'));
  assert.match(pages['/blog/archive.md'], /## 2025/);
  assert.match(pages['/blog/authors.md'], /Nick Mudge/);
  assert.match(pages['/blog/authors.md'], /MN/);
  assert.match(pages['/blog/tags.md'], /\[Architecture\]\(\/blog\/tags\/architecture\)/);
  assert.match(pages['/blog/tags/architecture.md'], /\[Diamond Architecture Metaphors\]\(\/blog\/diamond-architecture-metaphors\)/);
});
