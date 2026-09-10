// The platform layer, mirroring what `@react-navigation/native` does for
// React Native: it owns everything Lynx-specific that every navigator needs,
// and re-exports core so apps have a single import surface.
export { createStaticNavigation } from './createStaticNavigation';
export { LinkingContext } from './LinkingContext';
export { LocaleDirContext } from './LocaleDirContext';
export {
  NavigationContainer,
  type NavigationContainerLynxProps,
} from './NavigationContainer';
export { DarkTheme } from './theming/DarkTheme';
export { LightTheme as DefaultTheme } from './theming/LightTheme';
export { MaterialDarkTheme, MaterialLightTheme } from './theming/MaterialTheme';
export * from './types';
export { useLinkBuilder } from './useLinkBuilder';
export { useLinkTo } from './useLinkTo';
export { useLocale } from './useLocale';
export { useRoutePath } from './useRoutePath';

export {
  getInitialURL,
  INIT_DATA_KEY,
  RN_URL_EVENT,
  subscribe,
  URL_EVENT,
  type NavigationInitData,
} from './linking';

export * from '@react-navigation/core';
