import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COMPONENT_TOKEN_DEFAULTS,
  SEMANTIC_TOKENS,
  componentKeyToCssVar,
} from '../packages/tokens/src/schema.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function renderModeBlock(mode: 'light' | 'dark'): string {
  const lines = SEMANTIC_TOKENS.map((token) => {
    const value = mode === 'dark' ? token.dark : token.light;
    return `  ${token.cssVar}: ${value};`;
  });
  return `:where([data-dui-theme][data-mode='${mode}']) {\n${lines.join('\n')}\n}`;
}

function renderComponentDefaults(): string {
  const lines: string[] = [];
  for (const [component, tokens] of Object.entries(COMPONENT_TOKEN_DEFAULTS)) {
    for (const [name, value] of Object.entries(tokens)) {
      lines.push(`  ${componentKeyToCssVar(component, name)}: ${value};`);
    }
  }
  return `:where([data-dui-theme]) {\n${lines.join('\n')}\n}`;
}

const css = `/* Generated from packages/tokens/src/schema.ts — do not edit by hand */
@layer dui.tokens {
${renderModeBlock('light')}

${renderModeBlock('dark')}

${renderComponentDefaults()}
}
`;

const json = {
  schemaVersion: 1,
  tokens: SEMANTIC_TOKENS,
  components: COMPONENT_TOKEN_DEFAULTS,
};

const generatedDir = path.join(root, 'packages/tokens/src/generated');
const themeCss = path.join(root, 'packages/theme/src/tokens.generated.css');

await mkdir(generatedDir, { recursive: true });
await writeFile(path.join(generatedDir, 'tokens.json'), `${JSON.stringify(json, null, 2)}\n`);
await writeFile(themeCss, css);
await writeFile(path.join(generatedDir, '.gitkeep'), '');

console.log('generated tokens.css and tokens.json');
