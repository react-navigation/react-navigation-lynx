// Rewrite the publishable packages for a canary release, the way lynx-stack
// does it: the package is renamed rather than tagged, so `@react-navigation/lynx`
// ships its canaries as `@react-navigation/lynx-canary`. That keeps the real
// package's version list free of throwaway builds, and `latest` on the canary
// package is always the newest one.
//
// Run after `changeset version --snapshot canary`, which has already written
// the snapshot versions.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';
import path from 'node:path';

const DEPENDENCY_FIELDS = ['dependencies', 'optionalDependencies'];

function canaryName(name) {
  return `${name}-canary`;
}

/**
 * `changeset version --snapshot` writes a full timestamp and commit. Trim them
 * so the version stays readable: `0.1.0-canary-20260825-abc12345`.
 */
function canaryVersion(version) {
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

/**
 * The submodules are workspace members so we can develop against upstream
 * source. They are upstream's packages - renaming and publishing them would
 * put someone else's code out under our name.
 */
function isOurs(dir, root) {
  const relative = path.relative(root, dir);

  return relative.startsWith(`packages${path.sep}`);
}

function main() {
  const root = process.cwd();

  const workspace = JSON.parse(
    execSync('pnpm m ls --json --depth=-1', { encoding: 'utf8' })
  ).filter((pkg) => pkg.name != null && pkg.path != null);

  const ours = workspace.filter((pkg) => {
    if (!isOurs(pkg.path, root)) return false;

    const manifest = JSON.parse(
      readFileSync(path.join(pkg.path, 'package.json'), 'utf8')
    );

    return manifest.private !== true;
  });

  // Every canary package's version, so dependencies between them can be
  // pointed at the canary names rather than versions that were never published.
  const versions = new Map(
    ours.map((pkg) => {
      const manifest = JSON.parse(
        readFileSync(path.join(pkg.path, 'package.json'), 'utf8')
      );

      return [manifest.name, canaryVersion(manifest.version)];
    })
  );

  for (const pkg of ours) {
    const manifestPath = path.join(pkg.path, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    manifest.name = canaryName(manifest.name);
    manifest.version = canaryVersion(manifest.version);

    for (const field of DEPENDENCY_FIELDS) {
      for (const name of Object.keys(manifest[field] ?? {})) {
        if (versions.has(name)) {
          manifest[field][name] = `npm:${canaryName(name)}@${versions.get(name)}`;
        }
      }
    }

    // A canary's peers are whatever the consumer already has; pinning them to
    // a canary version would force that choice on them.
    for (const name of Object.keys(manifest.peerDependencies ?? {})) {
      if (versions.has(name)) {
        manifest.peerDependencies[name] = '*';
      }
    }

    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}${EOL}`);

    console.log(`${manifest.name}@${manifest.version}`);
  }
}

main();
