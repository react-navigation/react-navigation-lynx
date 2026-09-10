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
