// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { getPathFromState, useStateForPath } from '@react-navigation/core';
import * as React from 'react';

import { LinkingContext } from './LinkingContext';

export function useRoutePath() {
  const { options } = React.use(LinkingContext);
  const state = useStateForPath();

  if (state === undefined) {
    throw new Error(
      "Couldn't find a state for the route object. Is your component inside a screen in a navigator?"
    );
  }

  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState;

  const path = React.useMemo(() => {
    if (options?.enabled === false) {
      return undefined;
    }

    return getPathFromStateHelper(state, options?.config);
  }, [options?.enabled, options?.config, state, getPathFromStateHelper]);

  return path;
}
