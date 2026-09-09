import {
  type ParamListBase,
  StackActions,
  type StackNavigationState,
  usePreventRemoveContext,
} from '@react-navigation/core';
import { StackHostNativeComponent } from 'lynx-screens';
import type { Dispatch, ReactElement } from 'react';

import type {
  LynxStackDescriptorMap,
  LynxStackNavigationHelpers,
} from '../types';
import { CardScreen } from './CardScreen';
import { SheetScreen } from './SheetScreen';
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
  const { preventedRoutes } = usePreventRemoveContext();

  const routeIndexByKey = new Map(
    state.routes.map((route, index) => [route.key, index])
  );

  const onRemovePoppedRoute = (key: string) => {
    dispatch({ type: 'REMOVE_POPPED_ROUTE', key });
  };

  const onNativeDismiss = ({
    key,
    markNativelyDismissed,
  }: {
    key: string;
    markNativelyDismissed: boolean;
  }) => {
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
    // reducer must not keep them rendered waiting for a pop animation. A sheet
    // whose dismissal was prevented is the exception: it is still there.
    if (markNativelyDismissed) {
      dispatch({
        type: 'ADD_NATIVELY_DISMISSED_ROUTES',
        keys: currentState.routes
          .slice(index, currentState.index + 1)
          .map((route) => route.key),
      });
    }

    navigation.dispatch({
      ...StackActions.pop(dismissCount),
      source: key,
      target: currentState.key,
    });
  };

  // A prevented dismiss still has to reach the router when `usePreventRemove`
  // asked for it: that is what gives the hook its `beforeRemove` event to act
  // on. Prevention that came only from the `preventNativeDismiss` option has
  // no such listener, so dispatching would pop the screen the native side just
  // refused to dismiss.
  const onNativeDismissPrevented = (key: string) => {
    if (!preventedRoutes[key]?.preventRemove) {
      return;
    }

    const currentState = navigation.getState();

    navigation.dispatch({
      ...StackActions.pop(),
      source: key,
      target: currentState.key,
    });
  };

  const cards: ReactElement[] = [];
  // The native sheet is its own host, so these render outside the stack host
  // rather than as screens in it.
  const sheets: ReactElement[] = [];

  renderedRoutes.forEach((route) => {
    const index = routeIndexByKey.get(route.key);
    const popped = poppedByKey.get(route.key);
    const descriptor = descriptors[route.key] ?? popped?.descriptor;

    if (descriptor == null) {
      throw new Error(
        `Couldn't find descriptor for route ${route.name} (${route.key}). This is likely a bug.`
      );
    }

    const presentation = descriptor.options.presentation ?? 'card';

    if (presentation !== 'card' && presentation !== 'formSheet') {
      throw new Error(
        `The route '${route.name}' uses the '${presentation}' presentation, which the Lynx stack does not support. Only 'card' and 'formSheet' are available.`
      );
    }

    if (presentation === 'formSheet') {
      if (index === 0) {
        throw new Error(
          `The route '${route.name}' cannot use the 'formSheet' presentation because it is the first route in the stack. Add a screen with the 'card' presentation before it.`
        );
      }

      sheets.push(
        <SheetScreen
          key={route.key}
          descriptor={descriptor}
          navigation={navigation}
          isFocused={index === state.index}
          isPopped={popped != null}
          onRemovePoppedRoute={onRemovePoppedRoute}
          onNativeDismiss={(markNativelyDismissed) =>
            onNativeDismiss({ key: route.key, markNativelyDismissed })
          }
          onNativeDismissPrevented={() => onNativeDismissPrevented(route.key)}
        />
      );

      return;
    }

    cards.push(
      <CardScreen
        key={route.key}
        descriptor={descriptor}
        navigation={navigation}
        isFocused={index === state.index}
        isBeforeLast={index === state.index - 1}
        isPopped={popped != null}
        isDetached={index != null && index > state.index}
        onRemovePoppedRoute={onRemovePoppedRoute}
        onNativeDismiss={() =>
          onNativeDismiss({ key: route.key, markNativelyDismissed: true })
        }
        onNativeDismissPrevented={() => onNativeDismissPrevented(route.key)}
      />
    );
  });

  return (
    <>
      <StackHostNativeComponent>{cards}</StackHostNativeComponent>
      {sheets}
    </>
  );
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
