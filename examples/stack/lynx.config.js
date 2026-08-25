import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';

const require = createRequire(import.meta.url);

// `@react-navigation/core` is written against React. On Lynx those imports
// have to land on the package's compat layer, which fills the gaps ReactLynx
// has yet to cover (`use`, `useInsertionEffect`, `startTransition`).
const reactCompat = resolve(
  dirname(require.resolve('@react-navigation/lynx/package.json')),
  'src/react-compat.ts'
);

export default defineConfig({
  source: {
    entry: './src/index.tsx',
  },
  resolve: {
    alias: {
      react$: reactCompat,
    },
  },
  tools: {
    rspack: {
      resolve: {
        // Both submodules ship TypeScript sources whose relative imports carry
        // `.js`, which only resolves once you map it back onto the file that
        // actually exists.
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js'],
          '.jsx': ['.tsx', '.jsx'],
        },
        // Same condition the upstream monorepo uses to resolve its packages to
        // TypeScript source, so the submodule needs no build step.
        conditionNames: [
          '@react-navigation/source',
          'lynx',
          'import',
          'require',
          'default',
        ],
      },
    },
  },
  plugins: [
    pluginReactLynx(),
    // The build is the only place that exercises the source export condition
    // and the extension aliasing, so it should fail on type errors too rather
    // than leaving them to the editor.
    pluginTypeCheck({
      tsCheckerOptions: {
        issue: {
          // react-navigation's sources assume `@types/node` - upstream's root
          // tsconfig sets `types: ["node"]`, and `BaseNavigationContainer`
          // reaches for `Error.captureStackTrace`. This app is not a Node
          // program, so it reports what upstream's own CI already covers.
          exclude: [{ file: '../../react-navigation/**' }],
        },
      },
    }),
    pluginQRCode({
      schema(url) {
        return `${url}?fullscreen=true`;
      },
    }),
  ],
  environments: {
    lynx: {},
  },
});
