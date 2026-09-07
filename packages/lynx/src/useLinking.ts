import {
  getActionFromState as getActionFromStateDefault,
  getStateFromPath as getStateFromPathDefault,
  type NavigationContainerRef,
  type ParamListBase,
  type PartialState,
  type NavigationState,
} from '@react-navigation/core';
import * as React from 'react';

import { extractPathFromURL } from './extractPathFromURL';
import {
  getInitialURL as getInitialURLDefault,
  subscribe as subscribeDefault,
} from './linking';

// core keeps its `Options` type internal; derive it from the consumer so it
// cannot drift.
type LinkingConfig<ParamList extends {}> = NonNullable<
  Parameters<typeof getStateFromPathDefault<ParamList>>[1]
>;

export type LinkingPrefix = '*' | (string & {});

export type LinkingOptions<ParamList extends {}> = {
  /** Defaults to true when a config is given. */
  enabled?: boolean | undefined;
  prefixes?: LinkingPrefix[] | undefined;
  /** Rejects a URL before its prefix is stripped. */
  filter?: ((url: string) => boolean) | undefined;
  config?: LinkingConfig<ParamList> | undefined;
  /** Overrides where the launch URL comes from. */
  getInitialURL?: (() => string | undefined) | undefined;
  /** Overrides how later URLs arrive. */
  subscribe?:
    | ((listener: (url: string) => void) => undefined | void | (() => void))
    | undefined;
  getStateFromPath?: typeof getStateFromPathDefault | undefined;
  getActionFromState?: typeof getActionFromStateDefault | undefined;
} & { [key: string]: unknown };

/** The `getStateFromHref` contract of `@react-navigation/native`. */
function extractPath(
  url: string,
  prefixes: LinkingPrefix[] | undefined,
  filter: ((url: string) => boolean) | undefined
) {
  if (url.startsWith('/')) {
    return url;
  }

  if (filter && !filter(url)) {
    return undefined;
  }

  if (prefixes == null || prefixes.length === 0) {
    return undefined;
  }

  return extractPathFromURL(prefixes, url);
}

/** The Lynx counterpart of `useLinking` in `@react-navigation/native`. */
export function useLinking<ParamList extends {} = ParamListBase>(
  ref: React.RefObject<NavigationContainerRef<ParamListBase> | null>,
  options: LinkingOptions<ParamList> | undefined
) {
  const {
    enabled = options?.config != null,
    // Same default as React Native: strip whatever scheme the host used.
    prefixes = ['*'],
    filter,
    config,
    getInitialURL = getInitialURLDefault,
    subscribe = subscribeDefault,
    getStateFromPath = getStateFromPathDefault,
    getActionFromState = getActionFromStateDefault,
  } = options ?? {};

  const optionsRef = React.useRef({
    enabled,
    prefixes,
    filter,
    config,
    getStateFromPath,
    getActionFromState,
  });

  React.useEffect(() => {
    optionsRef.current = {
      enabled,
      prefixes,
      filter,
      config,
      getStateFromPath,
      getActionFromState,
    };
  });

  const getStateFromURL = React.useCallback(
    (url: string | undefined, previous: NavigationState | undefined) => {
      const current = optionsRef.current;

      if (!url) {
        return undefined;
      }

      const path = extractPath(url, current.prefixes, current.filter);

      if (path == null) {
        return undefined;
      }

      try {
        return current.getStateFromPath(path, current.config, previous);
      } catch {
        // A malformed link should not take the card down with it.
        return undefined;
      }
    },
    []
  );

  const getInitialState = React.useCallback(():
    | PartialState<NavigationState>
    | undefined => {
    if (!optionsRef.current.enabled) {
      return undefined;
    }

    return getStateFromURL(getInitialURL(), undefined);
    // Read once on mount: a later identity change must not re-run the route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStateFromURL]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (url: string) => {
      const navigation = ref.current;

      if (!navigation) {
        return;
      }

      const rootState = navigation.getRootState();
      const state = getStateFromURL(url, rootState);

      if (!state) {
        return;
      }

      const action = optionsRef.current.getActionFromState(
        state,
        optionsRef.current.config
      );

      if (action === undefined) {
        navigation.resetRoot(state);
        return;
      }

      try {
        navigation.dispatch({ target: rootState?.key, ...action });
      } catch (e) {
        console.warn(
          `An error occurred when trying to handle the link '${url}': ${
            e instanceof Error ? e.message : String(e)
          }`
        );
      }
    };

    return subscribe(listener) ?? undefined;
  }, [enabled, ref, getStateFromURL, subscribe]);

  return { getInitialState };
}
