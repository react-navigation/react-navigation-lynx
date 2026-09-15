// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  CommonActions,
  getActionFromState,
  getPathFromState,
  IsScreenContext,
  NavigationContainerRefContext,
  useStateForPath,
} from '@react-navigation/core';
import * as React from 'react';

import { getStateFromHref } from './getStateFromHref';
import { LinkingContext } from './LinkingContext';

type MinimalState = {
  routes: [
    {
      name: string;
      params?: object | undefined;
      state?: MinimalState | undefined;
    },
  ];
};

/**
 * Helper to build a href for a screen based on the linking options.
 */
export function useBuildHref() {
  const isScreen = React.use(IsScreenContext);
  const { options } = React.use(LinkingContext);
  const focusedRouteState = useStateForPath();

  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState;

  const buildHref = React.useCallback(
    (name: string, params?: object) => {
      if (options?.enabled === false) {
        return undefined;
      }

      const stateForRoute: MinimalState = {
        routes: [{ name, params }],
      };

      const constructState = (
        state: MinimalState | undefined
      ): MinimalState => {
        if (state) {
          const route = state.routes[0];

          // Inside a screen at the innermost route the provided state replaces
          // it: the target is a sibling.
          if (isScreen && !route.state) {
            return stateForRoute;
          }

          return {
            routes: [
              {
                ...route,
                state: constructState(route.state),
              },
            ],
          };
        }

        // No nested state left: the target is a child of this route, which is
        // the case when a navigator builds hrefs for its own routes.
        return stateForRoute;
      };

      const state = constructState(focusedRouteState);

      return getPathFromStateHelper(state, options?.config);
    },
    [
      options?.enabled,
      options?.config,
      isScreen,
      focusedRouteState,
      getPathFromStateHelper,
    ]
  );

  return buildHref;
}

/**
 * Helper to build a navigation action from a href based on the linking options.
 */
export function useBuildAction() {
  const navigation = React.use(NavigationContainerRefContext);

  if (navigation === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }

  const { options } = React.use(LinkingContext);

  const getActionFromStateHelper =
    options?.getActionFromState ?? getActionFromState;

  const buildAction = React.useCallback(
    (href: string) => {
      const rootState = navigation.getRootState();
      const state = getStateFromHref(href, options, rootState);

      if (state) {
        const action =
          getActionFromStateHelper(state, options?.config) ??
          CommonActions.reset(state);

        return { target: rootState?.key, ...action };
      }

      throw new Error(`Failed to parse href '${href}' to a navigation state.`);
    },
    [navigation, options, getActionFromStateHelper]
  );

  return buildAction;
}

/**
 * Helpers to build href or action based on the linking options.
 *
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
export function useLinkBuilder() {
  const buildHref = useBuildHref();
  const buildAction = useBuildAction();

  return {
    buildHref,
    buildAction,
  };
}
