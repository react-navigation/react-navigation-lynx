import { NavigationProvider, usePreventRemoveContext } from '@react-navigation/core';
import { StackScreenNativeComponent } from 'lynx-screens';

import type { LynxStackDescriptor, LynxStackNavigationHelpers } from '../types';

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
  const { preventedRoutes } = usePreventRemoveContext();

  const { route, options } = descriptor;
  const { contentStyle, preventNativeDismiss } = options;

  // A screen is kept out of the native hierarchy while it animates out or
  // while it sits above the focused index (preloaded / retained).
  const activityMode = isPopped || isDetached ? 'detached' : 'attached';

  // `usePreventRemove` publishes per-route intent; the option is the static
  // escape hatch for screens that always refuse a native dismiss.
  const isRemovePrevented =
    preventedRoutes[route.key]?.preventRemove ?? preventNativeDismiss;

  // Only the focused screen, the one behind it (so a swipe back reveals fresh
  // content) and detached screens stay live. `isBeforeLast` and `isFocused`
  // are read here rather than in the parent so the reasoning stays with the
  // component that acts on it.
  const isLive = isFocused || isBeforeLast || isDetached;

  return (
    <StackScreenNativeComponent
      screenKey={route.key}
      activityMode={activityMode}
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
        <view
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            ...contentStyle,
          }}
        >
          {isLive ? descriptor.render() : null}
        </view>
      </NavigationProvider>
    </StackScreenNativeComponent>
  );
}
