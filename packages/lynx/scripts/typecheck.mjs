// We consume react-navigation and lynx-screens as source, so `tsc` reports
// their diagnostics alongside ours. Those can't be clean here: core is written
// against React's own types, and this package maps `react` onto ReactLynx, so
// inference inside core degrades (implicit anys, `@ts-expect-error` directives
// that no longer fire). Both repos typecheck themselves with their own config.
//
// So: print everything, but only fail on diagnostics in our own sources.
import { spawnSync } from 'node:child_process';

const result = spawnSync('tsc', ['--noEmit', '--pretty', 'false'], {
  encoding: 'utf8',
  shell: true,
});

const lines = `${result.stdout ?? ''}${result.stderr ?? ''}`
  .split('\n')
  .filter(Boolean);

const ours = lines.filter((line) => line.startsWith('src/'));
const vendored = lines.filter(
  (line) => line.startsWith('../') && line.includes('error TS')
);

if (vendored.length > 0) {
  console.log(`${vendored.length} diagnostics in vendored sources (ignored):`);
  for (const line of vendored.slice(0, 5)) {
    console.log(`  ${line}`);
  }
  if (vendored.length > 5) {
    console.log(`  ... and ${vendored.length - 5} more`);
  }
  console.log('');
}

if (ours.length > 0) {
  console.error(`${ours.length} diagnostics in this package:`);
  for (const line of ours) {
    console.error(`  ${line}`);
  }
  process.exit(1);
}

console.log('No diagnostics in this package.');
