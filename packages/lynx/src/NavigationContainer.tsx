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

export type NavigationContainerLynxProps<
  ParamList extends {} = ParamListBase,
> = NavigationContainerProps & {
  /**
   * Theme handed to `useTheme` and to any navigator that reads colors.
   */
  theme?: Theme | undefined;
  /**
   * Rendered while persisted state is being restored.
   */
  fallback?: React.ReactNode | undefined;
  ref?: React.Ref<NavigationContainerRef<ParamList>> | undefined;
};

/**
 * The Lynx counterpart of `@react-navigation/native`'s `NavigationContainer`.
 *
 * It is the platform layer's entry point: everything a navigator needs that is
 * not navigation state itself - the theme, and eventually deep linking and
 * state persistence - is wired here rather than in each navigator.
 *
 * Not yet ported from React Native:
 *
 * - deep linking (`linking`), which needs a Lynx URL source
 * - state persistence, which needs a Lynx storage binding
 * - `useDocumentTitle`, which is a browser concern and has no Lynx meaning
 *
 * The hardware back button is deliberately absent: on Lynx it is handled by
 * the native stack per screen, through `preventNativeDismiss` and the dismiss
 * callbacks, so a container-level handler would fight with it.
 */
export function NavigationContainer<ParamList extends {} = ParamListBase>({
  theme = LightTheme,
  fallback = null,
  onStateChange,
  ref,
  ...rest
}: NavigationContainerLynxProps<ParamList>) {
  const refContainer =
    React.useRef<NavigationContainerRef<ParamListBase>>(null);

  React.useImperativeHandle(
    ref,
    () => refContainer.current as NavigationContainerRef<ParamList>
  );

  const handleStateChange = (state: Readonly<NavigationState> | undefined) => {
    onStateChange?.(state);
  };

  // Kept for parity with React Native, where this renders while persisted
  // state is being restored. With no persistence yet there is nothing to wait
  // for, so it only shows if a caller passes `fallback` and no children.
  if (rest.children == null) {
    return <ThemeProvider value={theme}>{fallback}</ThemeProvider>;
  }

  return (
    <BaseNavigationContainer
      {...rest}
      theme={theme}
      onStateChange={handleStateChange}
      ref={refContainer}
    />
  );
}
