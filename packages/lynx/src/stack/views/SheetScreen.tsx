// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  NavigationProvider,
  usePreventRemoveContext,
} from '@react-navigation/core';
import { FormSheetNativeComponent } from 'lynx-screens';

import type { LynxStackDescriptor, LynxStackNavigationHelpers } from '../types';

type Props = {
  descriptor: LynxStackDescriptor;
  navigation: LynxStackNavigationHelpers;
  isFocused: boolean;
  isPopped: boolean;
  onRemovePoppedRoute: (key: string) => void;
  onNativeDismiss: (markNativelyDismissed: boolean) => void;
  onNativeDismissPrevented: () => void;
};

/**
 * A `formSheet` route. The native sheet is its own host rather than a screen
 * inside the stack, so this renders as a sibling of the stack host and opens
 * and closes with focus instead of taking an activity mode.
 */
export function SheetScreen({
  descriptor,
  navigation,
  isFocused,
  isPopped,
  onRemovePoppedRoute,
  onNativeDismiss,
  onNativeDismissPrevented,
}: Props) {
  const { preventedRoutes } = usePreventRemoveContext();

  const { route, options } = descriptor;
  const { contentStyle } = options;

  // Prevention comes from `usePreventRemove` and nothing else, for the reason
  // `CardScreen` spells out: a static option would have the native side block
  // the gesture and the `onNativeDismissPrevented` round-trip pop the route
  // anyway, since only a `beforeRemove` listener can cancel that dispatch.
  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove === true;

  return (
    <FormSheetNativeComponent
      isOpen={isFocused}
      detents={options.sheetAllowedDetents}
      initialDetentIndex={options.sheetInitialDetentIndex}
      largestUndimmedDetentIndex={options.sheetLargestUndimmedDetentIndex}
      prefersGrabberVisible={options.sheetGrabberVisible}
      preferredCornerRadius={options.sheetCornerRadius}
      prefersScrollingExpandsWhenScrolledToEdge={
        options.sheetExpandsWhenScrolledToEdge
      }
      preventNativeDismiss={isRemovePrevented}
      nativeContainerStyle={{ backgroundColor: contentStyle?.backgroundColor }}
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
      onDidDisappear={() => {
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: true },
          target: route.key,
        });

        // The route stays rendered while the sheet animates out, which is what
        // gives it something to animate. This is where it finally goes.
        if (isPopped) {
          onRemovePoppedRoute(route.key);
        }
      }}
      onDetentChanged={(index) =>
        navigation.emit({
          type: 'sheetDetentChange',
          data: { index },
          target: route.key,
        })
      }
      onNativeDismiss={() => onNativeDismiss(!isRemovePrevented)}
      onNativeDismissPrevented={onNativeDismissPrevented}
    >
      <NavigationProvider navigation={descriptor.navigation} route={route}>
        <view
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            // `fitToContents` measures the content, so it must not be told to
            // fill the sheet.
            ...(options.sheetAllowedDetents === 'fitToContents'
              ? null
              : { height: '100%' }),
            ...contentStyle,
          }}
        >
          {descriptor.render()}
        </view>
      </NavigationProvider>
    </FormSheetNativeComponent>
  );
}
