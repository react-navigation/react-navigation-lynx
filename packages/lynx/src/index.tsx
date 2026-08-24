// The platform layer, mirroring what `@react-navigation/native` does for
// React Native: it owns everything Lynx-specific that every navigator needs,
// and re-exports core so apps have a single import surface.
export { createStaticNavigation } from './createStaticNavigation';
export type { LynxTheme } from './types';
export {
  NavigationContainer,
  type NavigationContainerLynxProps,
} from './NavigationContainer';
export { DarkTheme } from './theming/DarkTheme';
export { LightTheme as DefaultTheme } from './theming/LightTheme';

export * from '@react-navigation/core';
