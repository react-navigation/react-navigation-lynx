// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  type RootParamList,
  type StaticNavigation,
} from '@react-navigation/core';
import * as React from 'react';

import { NavigationContainer } from './NavigationContainer';

type Props<ParamList extends {}> = Omit<
  React.ComponentProps<typeof NavigationContainer<ParamList>>,
  'children'
>;

/**
 * Create a navigation component from a static navigation config, the same way
 * `@react-navigation/native` does. The returned component wraps
 * `NavigationContainer`.
 *
 * React Native's version also derives a linking config from the tree here.
 * That is left out until the container can act on one - generating paths that
 * nothing consumes would only look like deep linking works.
 *
 * @param tree Static navigation config.
 * @returns Navigation component to use in your app.
 */
export function createStaticNavigation(tree: StaticNavigation<any>) {
  const Component = tree.getComponent();

  function Navigation<ParamList extends {} = RootParamList>({
    ref,
    ...rest
  }: Props<ParamList>) {
    return (
      <NavigationContainer {...rest} ref={ref}>
        <Component />
      </NavigationContainer>
    );
  }

  return Navigation;
}
