type FontStyle = {
  fontFamily: string;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

/**
 * Core declares `Theme` as an empty interface for the platform layer to fill
 * in, the same way `@react-navigation/native` does for React Native. Keeping
 * the shape identical means themes carry over between the two unchanged.
 */
export interface LynxTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
}

declare module '@react-navigation/core' {
  interface Theme extends LynxTheme {}
}
