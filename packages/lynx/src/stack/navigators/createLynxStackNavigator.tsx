// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  createNavigatorFactory,
  createScreenFactory,
  type EventArg,
  NavigationMetaContext,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StackActionHelpers,
  StackActions,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';

import type {
  LynxStackNavigationEventMap,
  LynxStackNavigationOptions,
  LynxStackNavigatorProps,
} from '../types';
import { LynxStackView } from '../views/LynxStackView';

function LynxStackNavigator({
  initialRouteName,
  routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: LynxStackNavigatorProps) {
  const { state, descriptors, navigation, render } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    LynxStackNavigationOptions,
    LynxStackNavigationEventMap
  >(StackRouter, {
    initialRouteName,
    routeNamesChangeBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    router,
  });

  const meta = React.use(NavigationMetaContext);

  React.useEffect(() => {
    if (meta && 'type' in meta && meta.type === 'native-tabs') {
      return;
    }

    let handle: ReturnType<typeof requestAnimationFrame> | undefined;

    // @ts-expect-error: there may not be a tab navigator in parent
    const unsubscribe = navigation.addListener?.('tabPress', (e) => {
      const isFocused = navigation.isFocused();

      cancelAnimationFrame(handle);

      // Run the operation in the next frame so we're sure all listeners have been run
      // This is necessary to know if preventDefault() has been called
      handle = requestAnimationFrame(() => {
        const currentState = navigation.getState();

        if (
          isFocused &&
          (currentState.index > 0 || currentState.routes[0]?.history?.length) &&
          !(e as EventArg<'tabPress', true>).defaultPrevented
        ) {
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: currentState.key,
          });
        }
      });
    });

    return () => {
      cancelAnimationFrame(handle);
      unsubscribe?.();
    };
  }, [meta, navigation]);

  return render(
    <LynxStackView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
}

export interface LynxStackTypeBag extends NavigatorTypeBagBase {
  State: StackNavigationState<this['ParamList']>;
  ScreenOptions: LynxStackNavigationOptions;
  EventMap: LynxStackNavigationEventMap;
  ActionHelpers: StackActionHelpers<this['ParamList']>;
  Navigator: typeof LynxStackNavigator;
}

export const createLynxStackNavigator =
  createNavigatorFactory<LynxStackTypeBag>(LynxStackNavigator);

export const createLynxStackScreen = createScreenFactory<LynxStackTypeBag>();
