#!/usr/bin/env node

// Print the directories of publishable workspace packages that appear in the
// `releases` array of a `changeset status --output` JSON file, plus every
// workspace package they depend on. One path per line, relative to the
// repository root. Used by the pkg.pr.new workflow.
//
// The closure matters: a `workspace:` dependency that is not published
// alongside its dependent resolves to the dependent's local version, which may
// never have been released, and the preview 404s on install. Publishing the
// closure keeps it self-consistent - those deps become pkg.pr.new URLs pinned
// to the same commit.

const { execSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const DEPENDENCY_FIELDS = [
  'dependencies',
  'peerDependencies',
  'optionalDependencies',
];

function readWorkspace() {
  const packages = JSON.parse(
    execSync('pnpm m ls --json --depth=-1', { encoding: 'utf8' })
  );

  const byName = new Map();

  for (const pkg of packages) {
    if (pkg.name == null || pkg.path == null) continue;
    byName.set(pkg.name, pkg);
  }

  return byName;
}

// The submodules are workspace members so we can develop against upstream
// source, but they are upstream's packages - republishing them under a preview
// URL would put someone else's code out under our name. Only what lives in
// `packages/` is ours to publish; a `workspace:` dependency on a vendored
// package resolves to its local version, which is already on the registry.
function isOurs(pkg, root) {
  const relative = path.relative(root, pkg.path);

  return relative === 'packages' || relative.startsWith(`packages${path.sep}`);
}

function isPublishable(pkg) {
  const manifest = JSON.parse(
    readFileSync(path.join(pkg.path, 'package.json'), 'utf8')
  );

  return manifest.private !== true;
}

function collect(name, workspace, seen, root) {
  if (seen.has(name)) return;

  const pkg = workspace.get(name);

  if (pkg == null || !isPublishable(pkg) || !isOurs(pkg, root)) return;

  seen.add(name);

  const manifest = JSON.parse(
    readFileSync(path.join(pkg.path, 'package.json'), 'utf8')
  );

  for (const field of DEPENDENCY_FIELDS) {
    for (const dependency of Object.keys(manifest[field] ?? {})) {
      if (workspace.has(dependency)) {
        collect(dependency, workspace, seen, root);
      }
    }
  }
}

function main() {
  const statusFile = process.argv[2];

  if (statusFile == null) {
    console.error('usage: list-changeset-packages.cjs <changeset-status.json>');
    process.exit(1);
  }

  const status = JSON.parse(readFileSync(statusFile, 'utf8'));
  const workspace = readWorkspace();
  const seen = new Set();
  const root = process.cwd();

  for (const release of status.releases ?? []) {
    if (release.type === 'none') continue;
    collect(release.name, workspace, seen, root);
  }

  for (const name of seen) {
    console.log(path.relative(root, workspace.get(name).path) || '.');
  }
}

main();
