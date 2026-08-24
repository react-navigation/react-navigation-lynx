import {
  createNavigatorFactory,
  createScreenFactory,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StackActionHelpers,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/core';

import type {
  LynxStackNavigationEventMap,
  LynxStackNavigationOptions,
  LynxStackNavigatorProps,
} from '../types';
import { LynxStackView } from '../views/LynxStackView';

function LynxStackNavigator({
  initialRouteName,
  routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: LynxStackNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      LynxStackNavigationOptions,
      LynxStackNavigationEventMap
    >(StackRouter, {
      initialRouteName,
      routeNamesChangeBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      router,
    });

  return (
    <NavigationContent>
      <LynxStackView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export interface LynxStackTypeBag extends NavigatorTypeBagBase {
  State: StackNavigationState<this['ParamList']>;
  ScreenOptions: LynxStackNavigationOptions;
  EventMap: LynxStackNavigationEventMap;
  ActionHelpers: StackActionHelpers<this['ParamList']>;
  Navigator: typeof LynxStackNavigator;
}

export const createLynxStackNavigator =
  createNavigatorFactory<LynxStackTypeBag>(LynxStackNavigator);

export const createLynxStackScreen = createScreenFactory<LynxStackTypeBag>();
