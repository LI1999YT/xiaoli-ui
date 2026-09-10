import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'pack-output');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const publics = ['tokens', 'theme', 'react', 'vue'];
const errors: string[] = [];

for (const name of publics) {
  const pkgDir = path.join(root, 'packages', name);
  execFileSync('pnpm', ['pack', '--pack-destination', out], { cwd: pkgDir, stdio: 'inherit' });
}

const tarballs = (await readdir(out)).filter((file) => file.endsWith('.tgz'));
if (tarballs.length !== 4) errors.push(`expected 4 tarballs, got ${tarballs.length}`);

for (const file of tarballs) {
  const dir = await mkdtemp(path.join(tmpdir(), 'xiaoli-pack-'));
  execFileSync('tar', ['-xzf', path.join(out, file), '-C', dir]);
  const pkg = JSON.parse(await readFile(path.join(dir, 'package', 'package.json'), 'utf8')) as {
    name: string;
    dependencies?: Record<string, string>;
    exports?: Record<string, unknown>;
  };
  for (const [dep, version] of Object.entries(pkg.dependencies ?? {})) {
    if (version.startsWith('workspace:')) errors.push(`${pkg.name} 残留 workspace: 依赖 ${dep}`);
    if (dep.includes('internal-')) errors.push(`${pkg.name} 泄漏私有依赖 ${dep}`);
  }
  const walkExports = (value: unknown): string[] => {
    if (typeof value === 'string') return [value];
    if (!value || typeof value !== 'object') return [];
    return Object.values(value).flatMap(walkExports);
  };
  for (const relative of walkExports(pkg.exports)) {
    if (relative.endsWith('package.json')) continue;
    const target = path.join(dir, 'package', relative);
    try {
      await readFile(target);
    } catch {
      errors.push(`${pkg.name} export 指向不存在文件：${relative}`);
    }
  }
  await rm(dir, { recursive: true, force: true });
}

const report = { ok: errors.length === 0, errors, tarballs };
await writeFile(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error(report);
  process.exit(1);
}
console.log('pack:check passed', tarballs);
