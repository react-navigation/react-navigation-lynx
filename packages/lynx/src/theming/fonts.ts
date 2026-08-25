import type { LynxTheme } from '../types';

/**
 * React Native picks per-platform families here (`System` on iOS,
 * `sans-serif*` on Android). Lynx resolves the platform default when no family
 * is named, so weights are all that need to differ.
 */
export const fonts: LynxTheme['fonts'] = {
  regular: {
    fontFamily: '',
    fontWeight: '400',
  },
  medium: {
    fontFamily: '',
    fontWeight: '500',
  },
  bold: {
    fontFamily: '',
    fontWeight: '600',
  },
  heavy: {
    fontFamily: '',
    fontWeight: '700',
  },
};
