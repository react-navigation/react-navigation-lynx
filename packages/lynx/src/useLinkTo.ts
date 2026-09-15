// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { NavigationRootContext } from '@react-navigation/core';
import * as React from 'react';

import { useBuildAction } from './useLinkBuilder';

export function useLinkTo() {
  const navigation = React.use(NavigationRootContext);

  if (navigation === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }

  const buildAction = useBuildAction();

  const linkTo = React.useCallback(
    (href: string) => {
      const action = buildAction(href);

      navigation.dispatch(action);
    },
    [buildAction, navigation]
  );

  return linkTo;
}
