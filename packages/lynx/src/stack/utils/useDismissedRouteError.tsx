// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/core';
import * as React from 'react';

export function useDismissedRouteError(
  state: StackNavigationState<ParamListBase>
) {
  const [nextDismissedKey, setNextDismissedKey] = React.useState<string | null>(
    null
  );

  const dismissedRouteName = nextDismissedKey
    ? state.routes.find((route) => route.key === nextDismissedKey)?.name
    : null;

  React.useEffect(() => {
    if (dismissedRouteName) {
      const message =
        `The screen '${dismissedRouteName}' was removed natively but didn't get removed from JS state. ` +
        `This can happen if the action was prevented in a 'beforeRemove' listener, which is not fully supported in the Lynx stack.\n\n` +
        `Consider using a 'usePreventRemove' hook instead.`;

      console.error(message);
    }
  }, [dismissedRouteName]);

  return { setNextDismissedKey };
}
