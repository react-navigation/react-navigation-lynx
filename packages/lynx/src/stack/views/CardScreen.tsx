// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  NavigationProvider,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/core';
import { StackScreenNativeComponent } from 'lynx-screens';

import type {
  LynxStackDescriptor,
  LynxStackNavigationHelpers,
} from '../types';
import { CardContent } from './CardContent';

type Props = {
  descriptor: LynxStackDescriptor;
  navigation: LynxStackNavigationHelpers;
  isFocused: boolean;
  isBeforeLast: boolean;
  isPopped: boolean;
  isDetached: boolean;
  onRemovePoppedRoute: (key: string) => void;
  onNativeDismiss: () => void;
  onNativeDismissPrevented: () => void;
};

export function CardScreen({
  descriptor,
  navigation,
  isFocused,
  isBeforeLast,
  isPopped,
  isDetached,
  onRemovePoppedRoute,
  onNativeDismiss,
  onNativeDismissPrevented,
}: Props) {
  const { colors } = useTheme();
  const { preventedRoutes } = usePreventRemoveContext();

  const { route, options } = descriptor;

  const { inactiveBehavior = 'pause' } = options;

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;
  const hasNestedState = 'state' in route && route.state != null;

  let activityMode: 'normal' | 'inert' | 'paused' | 'unmounted';

  if (isPopped) {
    // The screen is animating out, so don't let it handle any interaction
    activityMode = 'inert';
  } else if (
    // Render focused screens normally
    isFocused ||
    // Unpause previous screen so update isn't delayed for swipe back
    isBeforeLast ||
    // Unpause preloaded and retained screens so updates are visible
    // This lets effects on those screens run
    isDetached
  ) {
    activityMode = 'normal';
  } else {
    switch (inactiveBehavior) {
      case 'none':
        activityMode = 'normal';
        break;
      case 'unmount':
        activityMode = hasNestedState ? 'paused' : 'unmounted';
        break;
      case 'pause':
        activityMode = 'paused';
        break;
    }
  }

  return (
    <StackScreenNativeComponent
      screenKey={route.key}
      activityMode={isPopped || isDetached ? 'detached' : 'attached'}
      preventNativeDismiss={isRemovePrevented}
      onWillAppear={() =>
        navigation.emit({
          type: 'transitionStart',
          data: { closing: false },
          target: route.key,
        })
      }
      onDidAppear={() =>
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: false },
          target: route.key,
        })
      }
      onWillDisappear={() =>
        navigation.emit({
          type: 'transitionStart',
          data: { closing: true },
          target: route.key,
        })
      }
      onDidDisappear={() =>
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: true },
          target: route.key,
        })
      }
      onDismiss={onRemovePoppedRoute}
      onNativeDismiss={onNativeDismiss}
      onNativeDismissPrevented={onNativeDismissPrevented}
    >
      <NavigationProvider navigation={descriptor.navigation} route={route}>
        <CardContent
          descriptor={descriptor}
          activityMode={activityMode}
          backgroundColor={colors.background}
        />
      </NavigationProvider>
    </StackScreenNativeComponent>
  );
}
