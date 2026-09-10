import type { LynxTheme } from '../types';

import { fonts } from './fonts';

/** Same palette as `@react-navigation/native`'s Material fallback themes. */
export const MaterialLightFallbackTheme = {
  dark: false,
  colors: {
    primary: '#6750a4',
    background: '#f3edf7',
    card: '#fef7ff',
    text: '#1d1b20',
    border: '#cac4d0',
    notification: '#ba1a1a',
  },
  fonts,
} as const satisfies LynxTheme;

export const MaterialDarkFallbackTheme = {
  dark: true,
  colors: {
    primary: '#d0bcff',
    background: '#211f26',
    card: '#141218',
    text: '#e6e0e9',
    border: '#49454f',
    notification: '#ffb4ab',
  },
  fonts,
} as const satisfies LynxTheme;
