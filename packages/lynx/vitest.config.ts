import { vitestTestingLibraryPlugin } from '@lynx-js/react/testing-library/plugins';
import { defineConfig } from 'vitest/config';

// `@react-navigation/core` publishes its TypeScript sources behind this
// condition, which is how the vendored submodule is consumed without a build
// step. tsconfig already sets `customConditions`; this is the same thing for
// the test runner. Tests transform through the SSR pipeline, so it has to be
// declared there too.
const conditions = ['@react-navigation/source'];

export default defineConfig({
  plugins: [
    vitestTestingLibraryPlugin({
      runtimePkgName: '@lynx-js/react',
    }),
  ],
  resolve: { conditions },
  ssr: { resolve: { conditions } },
  test: {
    name: '@react-navigation/lynx',
  },
});
