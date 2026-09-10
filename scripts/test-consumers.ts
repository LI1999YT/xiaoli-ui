import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packDir = path.join(root, 'pack-output');
const work = await mkdtemp(path.join(tmpdir(), 'xiaoli-consumers-'));

function tarball(name: string): string {
  const prefix = name.replace('@', '').replace('/', '-');
  const files = execFileSync('sh', ['-c', `ls ${packDir}/${prefix}-*.tgz`], { encoding: 'utf8' })
    .trim()
    .split('\n');
  if (!files[0]) throw new Error(`missing tarball for ${name}`);
  return files[0];
}

async function scaffold(kind: 'react' | 'vue') {
  const dir = path.join(work, kind);
  await mkdir(path.join(dir, 'src'), { recursive: true });
  const tokensTar = tarball('@xiaoli-ui/tokens');
  const themeTar = tarball('@xiaoli-ui/theme');
  const uiTar = tarball(`@xiaoli-ui/${kind}`);
  const pkg = {
    name: `consumer-${kind}`,
    private: true,
    type: 'module',
    scripts: { build: 'vite build' },
    dependencies: {
      '@xiaoli-ui/tokens': `file:${tokensTar}`,
      '@xiaoli-ui/theme': `file:${themeTar}`,
      [`@xiaoli-ui/${kind}`]: `file:${uiTar}`,
      ...(kind === 'react'
        ? { react: '19.1.1', 'react-dom': '19.1.1' }
        : { vue: '3.5.21' }),
    },
    devDependencies: {
      vite: '7.1.5',
      ...(kind === 'react'
        ? { '@vitejs/plugin-react': '5.0.2' }
        : { '@vitejs/plugin-vue': '6.0.1' }),
    },
    pnpm: {
      overrides: {
        '@xiaoli-ui/tokens': `file:${tokensTar}`,
        '@xiaoli-ui/theme': `file:${themeTar}`,
        [`@xiaoli-ui/${kind}`]: `file:${uiTar}`,
      },
    },
  };
  await writeFile(path.join(dir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
  await writeFile(
    path.join(dir, 'vite.config.ts'),
    kind === 'react'
      ? `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });\n`
      : `import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nexport default defineConfig({ plugins: [vue()] });\n`,
  );
  if (kind === 'react') {
    await writeFile(
      path.join(dir, 'index.html'),
      `<div id="root"></div><script type="module" src="/src/main.tsx"></script>`,
    );
    await writeFile(
      path.join(dir, 'src/main.tsx'),
      `import { createRoot } from 'react-dom/client';
import { Button, ConfigProvider } from '@xiaoli-ui/react';
import '@xiaoli-ui/react/style.css';
createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{ id: 'consumer' }}><Button>ok</Button></ConfigProvider>
);
`,
    );
  } else {
    await writeFile(
      path.join(dir, 'index.html'),
      `<div id="app"></div><script type="module" src="/src/main.ts"></script>`,
    );
    await writeFile(
      path.join(dir, 'src/main.ts'),
      `import { createApp, h } from 'vue';
import { Button, ConfigProvider } from '@xiaoli-ui/vue';
import '@xiaoli-ui/vue/style.css';
createApp({ render: () => h(ConfigProvider, { theme: { id: 'consumer' } }, () => h(Button, null, () => 'ok')) }).mount('#app');
`,
    );
  }
  await writeFile(
    path.join(dir, '.npmrc'),
    ['ignore-workspace=true', 'prefer-workspace-packages=false', 'link-workspace-packages=false', ''].join('\n'),
  );
  execFileSync('pnpm', ['install', '--ignore-workspace'], { cwd: dir, stdio: 'inherit' });
  execFileSync('pnpm', ['build'], { cwd: dir, stdio: 'inherit' });
}

try {
  await scaffold('react');
  await scaffold('vue');
  console.log('test:consumers passed');
} finally {
  await rm(work, { recursive: true, force: true });
}
