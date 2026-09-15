// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  BaseNavigationContainer,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  type NavigationContainerProps,
  type NavigationContainerRef,
  type NavigationState,
  type ParamListBase,
  type Theme,
  ThemeProvider,
  validatePathConfig,
} from '@react-navigation/core';
import * as React from 'react';

import { LinkingContext } from './LinkingContext';
import { LocaleDirContext } from './LocaleDirContext';
import { LightTheme } from './theming/LightTheme';
import type { LinkingOptions, LocaleDirection } from './types';
import { useLinking } from './useLinking';

const DEFAULT_DIRECTION: LocaleDirection = 'ltr';

export type NavigationContainerLynxProps<
  ParamList extends {} = ParamListBase,
> = NavigationContainerProps & {
  theme?: Theme | undefined;
  /** Text direction of the components. Defaults to `'ltr'`. */
  direction?: LocaleDirection | undefined;
  /** Rendered while persisted state is being restored. */
  fallback?: React.ReactNode | undefined;
  /** Maps URLs handed over by the host onto navigation state. */
  linking?: LinkingOptions<ParamList> | undefined;
  ref?: React.Ref<NavigationContainerRef<ParamList>> | undefined;
};

/**
 * The Lynx counterpart of `@react-navigation/native`'s `NavigationContainer`.
 *
 * No state persistence yet, and no back-button handler: the native stack owns
 * dismissal per screen, so a container-level one would fight with it.
 */
export function NavigationContainer<ParamList extends {} = ParamListBase>({
  theme = LightTheme,
  direction = DEFAULT_DIRECTION,
  fallback = null,
  onStateChange,
  linking,
  ref,
  ...rest
}: NavigationContainerLynxProps<ParamList>) {
  const refContainer =
    React.useRef<NavigationContainerRef<ParamListBase>>(null);

  React.useImperativeHandle(
    ref,
    () => refContainer.current as NavigationContainerRef<ParamList>
  );

  const { getInitialState } = useLinking(refContainer, linking);

  // Read once: later URLs go through the subscription instead.
  const [linkingInitialState] = React.useState(() =>
    rest.initialState != null ? undefined : getInitialState()
  );

  const linkingConfig = React.useMemo(() => {
    if (linking == null) {
      return { options: { enabled: false } };
    }

    if (linking.config) {
      validatePathConfig(linking.config);
    }

    return {
      options: {
        ...linking,
        enabled: linking.enabled !== false,
        prefixes: linking.prefixes ?? ['*'],
        getStateFromPath: linking.getStateFromPath ?? getStateFromPath,
        getPathFromState: linking.getPathFromState ?? getPathFromState,
        getActionFromState: linking.getActionFromState ?? getActionFromState,
      },
    };
  }, [linking]);

  const { children: _children, ...restWithoutChildren } = rest;

  const handleStateChange = (state: Readonly<NavigationState> | undefined) => {
    onStateChange?.(state);
  };

  if (rest.children == null) {
    return (
      <LocaleDirContext.Provider value={direction}>
        <ThemeProvider value={theme}>{fallback}</ThemeProvider>
      </LocaleDirContext.Provider>
    );
  }

  return (
    <LocaleDirContext.Provider value={direction}>
      <LinkingContext.Provider value={linkingConfig}>
        <BaseNavigationContainer
          {...restWithoutChildren}
          initialState={rest.initialState ?? linkingInitialState}
          theme={theme}
          onStateChange={handleStateChange}
          ref={refContainer}
        >
          {rest.children}
        </BaseNavigationContainer>
      </LinkingContext.Provider>
    </LocaleDirContext.Provider>
  );
}
