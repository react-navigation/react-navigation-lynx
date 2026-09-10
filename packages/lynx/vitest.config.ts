import { vitestTestingLibraryPlugin } from '@lynx-js/react/testing-library/plugins';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    vitestTestingLibraryPlugin({
      runtimePkgName: '@lynx-js/react',
    }),
  ],
  test: {
    name: '@react-navigation/lynx',
  },
});
