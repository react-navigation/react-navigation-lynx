import {
  type ParamListBase,
  StackActions,
  type StackNavigationState,
} from '@react-navigation/core';
import { StackHostNativeComponent } from 'lynx-screens';
import type { Dispatch, ReactElement } from 'react';

import type {
  LynxStackDescriptorMap,
  LynxStackNavigationHelpers,
} from '../types';
import { CardScreen } from './CardScreen';
import {
  type LynxStackViewState,
  type LynxStackViewStateAction,
  useViewState,
} from './LynxStackViewState';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: LynxStackNavigationHelpers;
  descriptors: LynxStackDescriptorMap;
};

type ContentProps = Props &
  Pick<LynxStackViewState, 'renderedRoutes' | 'poppedByKey'> & {
    dispatch: Dispatch<LynxStackViewStateAction>;
  };

function LynxStackViewContent({
  state,
  navigation,
  descriptors,
  renderedRoutes,
  poppedByKey,
  dispatch,
}: ContentProps) {
  const routeIndexByKey = new Map(
    state.routes.map((route, index) => [route.key, index])
  );

  const onRemovePoppedRoute = (key: string) => {
    dispatch({ type: 'REMOVE_POPPED_ROUTE', key });
  };

  const onNativeDismiss = (key: string) => {
    const currentState = navigation.getState();
    const index = currentState.routes.findIndex((route) => route.key === key);

    if (index === -1) {
      return;
    }

    const dismissCount = currentState.index - index + 1;

    if (dismissCount < 1) {
      return;
    }

    // The native side has already taken these screens off the stack, so the
    // reducer must not keep them rendered waiting for a pop animation.
    dispatch({
      type: 'ADD_NATIVELY_DISMISSED_ROUTES',
      keys: currentState.routes
        .slice(index, currentState.index + 1)
        .map((route) => route.key),
    });

    navigation.dispatch({
      ...StackActions.pop(dismissCount),
      source: key,
      target: currentState.key,
    });
  };

  // A prevented dismiss still has to reach the router: that is what gives
  // `usePreventRemove` its `beforeRemove` event to act on.
  const onNativeDismissPrevented = (key: string) => {
    const currentState = navigation.getState();

    navigation.dispatch({
      ...StackActions.pop(),
      source: key,
      target: currentState.key,
    });
  };

  const cards = renderedRoutes.reduce<ReactElement[]>((result, route) => {
    const index = routeIndexByKey.get(route.key);
    const popped = poppedByKey.get(route.key);
    const descriptor = descriptors[route.key] ?? popped?.descriptor;

    if (descriptor == null) {
      throw new Error(
        `Couldn't find descriptor for route ${route.name} (${route.key}). This is likely a bug.`
      );
    }

    const presentation = descriptor.options.presentation ?? 'card';

    if (presentation !== 'card') {
      throw new Error(
        `The route '${route.name}' uses the '${presentation}' presentation, which the Lynx stack does not support yet. Only 'card' is available while form sheet support lands in lynx-screens.`
      );
    }

    result.push(
      <CardScreen
        key={route.key}
        descriptor={descriptor}
        navigation={navigation}
        isFocused={index === state.index}
        isBeforeLast={index === state.index - 1}
        isPopped={popped != null}
        isDetached={index != null && index > state.index}
        onRemovePoppedRoute={onRemovePoppedRoute}
        onNativeDismiss={() => onNativeDismiss(route.key)}
        onNativeDismissPrevented={() => onNativeDismissPrevented(route.key)}
      />
    );

    return result;
  }, []);

  return <StackHostNativeComponent>{cards}</StackHostNativeComponent>;
}

export function LynxStackView({ state, navigation, descriptors }: Props) {
  const [{ renderedRoutes, poppedByKey }, dispatch] = useViewState({
    state,
    descriptors,
  });

  return (
    <LynxStackViewContent
      state={state}
      navigation={navigation}
      descriptors={descriptors}
      renderedRoutes={renderedRoutes}
      poppedByKey={poppedByKey}
      dispatch={dispatch}
    />
  );
}
