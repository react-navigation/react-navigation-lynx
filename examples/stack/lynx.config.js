import { createRequire } from 'node:module';

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';

const require = createRequire(import.meta.url);

const reactCompat = require.resolve('@react-navigation/lynx/react-compat');

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
    pluginTypeCheck({
      tsCheckerOptions: {
        issue: {
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
