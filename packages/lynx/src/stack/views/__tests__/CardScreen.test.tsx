// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { expect, test } from 'vitest';
import {
  createNavigationContainerRef,
  type ParamListBase,
} from '@react-navigation/core';
import { act, render } from '@lynx-js/react/testing-library';

import { NavigationContainer } from '../../../NavigationContainer';
import type { LynxStackNavigationOptions } from '../../types';
import { createLynxStackNavigator } from '../../navigators/createLynxStackNavigator';

const renderStack = (screenOptions: LynxStackNavigationOptions = {}) => {
  const Stack = createLynxStackNavigator();
  const ref = createNavigationContainerRef<ParamListBase>();

  const screen = (name: string) => () => <text>{`content of ${name}`}</text>;

  const result = render(
    <NavigationContainer ref={ref}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name='A' component={screen('A')} />
        <Stack.Screen name='B' component={screen('B')} />
        <Stack.Screen name='C' component={screen('C')} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return { ...result, ref };
};

test('keeps a popped screen rendered until the native side dismisses it', () => {
  const { container, ref } = renderStack();

  act(() => ref.navigate('B'));
  expect(container.textContent).toContain('content of B');

  act(() => ref.goBack());

  expect(container.textContent).toContain('content of B');
});

test('keeps screens deeper than the one behind the top rendered by default', () => {
  const { container, ref } = renderStack();

  act(() => ref.navigate('B'));
  act(() => ref.navigate('C'));

  expect(container.textContent).toContain('content of A');
});

test('unmounts screens deeper than the one behind the top with inactiveBehavior unmount', () => {
  const { container, ref } = renderStack({ inactiveBehavior: 'unmount' });

  act(() => ref.navigate('B'));
  act(() => ref.navigate('C'));

  expect(container.textContent).not.toContain('content of A');
  expect(container.textContent).toContain('content of B');
});
