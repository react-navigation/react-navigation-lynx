// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { expect, test } from 'vitest';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type NavigationHelpers,
  type ParamListBase,
  StackActions,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/core';
import type { ReactNode } from '@lynx-js/react';
import { act, render } from '@lynx-js/react/testing-library';

import { NavigationContainer } from '../../../NavigationContainer';
import { createLynxStackNavigator } from '../createLynxStackNavigator';

const screen = (name: string) => () => <text>{`content of ${name}`}</text>;

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

test('throws when a route is pushed above a form sheet', () => {
  const Stack = createLynxStackNavigator();
  const ref = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={ref}>
      <Stack.Navigator>
        <Stack.Screen name='A' component={screen('A')} />
        <Stack.Screen
          name='Sheet'
          component={screen('Sheet')}
          options={{ presentation: 'formSheet' }}
        />
        <Stack.Screen name='B' component={screen('B')} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => ref.navigate('Sheet'));

  expect(() => act(() => ref.navigate('B'))).toThrow(
    /was pushed above the form sheet route 'Sheet'/
  );
});

test('throws when a form sheet replaces another form sheet', () => {
  const Stack = createLynxStackNavigator();
  const ref = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={ref}>
      <Stack.Navigator>
        <Stack.Screen name='A' component={screen('A')} />
        <Stack.Screen
          name='First'
          component={screen('First')}
          options={{ presentation: 'formSheet' }}
        />
        <Stack.Screen
          name='Second'
          component={screen('Second')}
          options={{ presentation: 'formSheet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => ref.navigate('First'));

  expect(() => act(() => ref.dispatch(StackActions.replace('Second')))).toThrow(
    /cannot replace 'First'/
  );
});

test('pops to top when the focused tab is pressed again', async () => {
  let tabs:
    | NavigationHelpers<
        ParamListBase,
        { tabPress: { data: undefined; canPreventDefault: true } }
      >
    | undefined;

  function TabNavigator({ children }: { children: ReactNode }) {
    const { state, descriptors, navigation, render } = useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      object,
      { tabPress: { data: undefined; canPreventDefault: true } }
    >(TabRouter, { children });

    tabs = navigation;

    const focused = state.routes[state.index];

    return render(
      <view>{focused ? descriptors[focused.key]?.render() : null}</view>
    );
  }

  const Tabs = createNavigatorFactory(TabNavigator)();
  const Stack = createLynxStackNavigator();
  const ref = createNavigationContainerRef<ParamListBase>();

  function Feed() {
    return (
      <Stack.Navigator>
        <Stack.Screen name='A' component={screen('A')} />
        <Stack.Screen name='B' component={screen('B')} />
      </Stack.Navigator>
    );
  }

  render(
    <NavigationContainer ref={ref}>
      <Tabs.Navigator>
        <Tabs.Screen name='Feed' component={Feed} />
      </Tabs.Navigator>
    </NavigationContainer>
  );

  act(() => ref.navigate('B'));
  expect(ref.getCurrentRoute()?.name).toBe('B');

  const feedKey = ref.getRootState()?.routes[0]?.key;

  expect(feedKey).toBeDefined();

  await act(async () => {
    tabs?.emit({
      type: 'tabPress',
      target: feedKey as string,
      canPreventDefault: true,
    });
    await nextFrame();
  });

  expect(ref.getCurrentRoute()?.name).toBe('A');
});
