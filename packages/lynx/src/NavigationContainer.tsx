import {
  BaseNavigationContainer,
  type NavigationContainerProps,
  type NavigationContainerRef,
  type NavigationState,
  type ParamListBase,
  type Theme,
  ThemeProvider,
} from '@react-navigation/core';
import * as React from 'react';

import { LightTheme } from './theming/LightTheme';
import { type LinkingOptions, useLinking } from './useLinking';

export type NavigationContainerLynxProps<
  ParamList extends {} = ParamListBase,
> = NavigationContainerProps & {
  theme?: Theme | undefined;
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

  const { children: _children, ...restWithoutChildren } = rest;

  const handleStateChange = (state: Readonly<NavigationState> | undefined) => {
    onStateChange?.(state);
  };

  if (rest.children == null) {
    return <ThemeProvider value={theme}>{fallback}</ThemeProvider>;
  }

  return (
    <BaseNavigationContainer
      {...restWithoutChildren}
      initialState={rest.initialState ?? linkingInitialState}
      theme={theme}
      onStateChange={handleStateChange}
      ref={refContainer}
    >
      {rest.children}
    </BaseNavigationContainer>
  );
}
