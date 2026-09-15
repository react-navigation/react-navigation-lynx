// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type {
  getActionFromState as getActionFromStateDefault,
  getPathFromState as getPathFromStateDefault,
  getStateFromPath as getStateFromPathDefault,
} from '@react-navigation/core';

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

export type LocaleDirection = 'ltr' | 'rtl';

// core keeps its `Options` type internal; derive it from the consumer so it
// cannot drift.
type LinkingConfig<ParamList extends {}> = NonNullable<
  Parameters<typeof getStateFromPathDefault<ParamList>>[1]
>;

export type LinkingPrefix = '*' | (string & {});

export type LinkingOptions<ParamList extends {}> = {
  /** Defaults to true when a config is given. */
  enabled?: boolean | undefined;
  prefixes?: LinkingPrefix[] | undefined;
  /** Rejects a URL before its prefix is stripped. */
  filter?: ((url: string) => boolean) | undefined;
  config?: LinkingConfig<ParamList> | undefined;
  /** Overrides where the launch URL comes from. */
  getInitialURL?: (() => string | undefined) | undefined;
  /** Overrides how later URLs arrive. */
  subscribe?:
    | ((listener: (url: string) => void) => undefined | void | (() => void))
    | undefined;
  getStateFromPath?: typeof getStateFromPathDefault | undefined;
  getPathFromState?: typeof getPathFromStateDefault | undefined;
  getActionFromState?: typeof getActionFromStateDefault | undefined;
} & { [key: string]: unknown };
