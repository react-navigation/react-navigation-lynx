import { createRequire } from 'node:module';
import path from 'node:path';

import { vitestTestingLibraryPlugin } from '@lynx-js/react/testing-library/plugins';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const requireFromCore = createRequire(
  require.resolve('@react-navigation/core'),
);

export default defineConfig({
  plugins: [
    vitestTestingLibraryPlugin({
      runtimePkgName: '@lynx-js/react',
    }),
  ],
  test: {
    name: '@react-navigation/lynx',
    alias: [
      { find: /^react$/, replacement: require.resolve('@lynx-js/react/compat') },
      {
        find: /^use-latest-callback$/,
        replacement: path.join(
          path.dirname(requireFromCore.resolve('use-latest-callback')),
          '../../src/index.ts',
        ),
      },
    ],
  },
});
