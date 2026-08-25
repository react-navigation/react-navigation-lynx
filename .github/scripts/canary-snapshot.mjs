// Shorten the versions `changeset version --snapshot canary` just wrote.
//
// It produces `0.1.0-canary-20260825085751-8f531b1a8f9467bf83c919bc5cc78260a2699386`;
// this trims the timestamp to a date and the commit to eight characters, which
// is enough to identify a build and short enough to read in an install command.
//
// Canaries go out under the real package name with the `canary` dist-tag, so
// there is nothing else to rewrite: `latest` keeps pointing at the last real
// release, and `workspace:` dependencies are resolved by pnpm at publish time.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';
import path from 'node:path';

/**
 * The submodules are workspace members so we can develop against upstream
 * source. Their versions are upstream's to set.
 */
function isOurs(dir, root) {
  const relative = path.relative(root, dir);

  return relative.startsWith(`packages${path.sep}`);
}

function shorten(version) {
  const [base, tag, datetime, commit, ...rest] = version.split('-');

  if (base && tag && datetime && commit) {
    return [
      base,
      tag,
      datetime.slice(0, 'yyyymmdd'.length),
      commit.slice(0, 8),
      ...rest,
    ].join('-');
  }

  return version;
}

function main() {
  const root = process.cwd();

  const workspace = JSON.parse(
    execSync('pnpm m ls --json --depth=-1', { encoding: 'utf8' })
  ).filter((pkg) => pkg.name != null && pkg.path != null);

  for (const pkg of workspace) {
    if (!isOurs(pkg.path, root)) continue;

    const manifestPath = path.join(pkg.path, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    if (manifest.private === true) continue;

    manifest.version = shorten(manifest.version);

    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}${EOL}`);

    console.log(`${manifest.name}@${manifest.version}`);
  }
}

main();
