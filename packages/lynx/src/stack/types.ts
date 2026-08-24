import type {
  DefaultNavigatorOptions,
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  RouteProp,
  StackActionHelpers,
  StackNavigationState,
  StackRouterOptions,
} from '@react-navigation/core';
import type * as Lynx from '@lynx-js/types';

export type LynxStackPresentation = 'card' | 'formSheet';

export type LynxStackNavigationOptions = {
  presentation?: LynxStackPresentation | undefined;
  contentStyle?: Lynx.CSSProperties | undefined;
};

export type LynxStackNavigationEventMap = {
  transitionStart: { data: { closing: boolean } };
  transitionEnd: { data: { closing: boolean } };
};

export type LynxStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState<ParamList>,
  LynxStackNavigationOptions,
  LynxStackNavigationEventMap,
  StackActionHelpers<ParamList>
>;

export type LynxStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
> = {
  navigation: LynxStackNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export type LynxStackNavigationHelpers = NavigationHelpers<
  ParamListBase,
  LynxStackNavigationEventMap
>;

export type LynxStackDescriptor = Descriptor<
  LynxStackNavigationOptions,
  LynxStackNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type LynxStackDescriptorMap = Record<string, LynxStackDescriptor>;

export type LynxStackNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  LynxStackNavigationOptions,
  LynxStackNavigationEventMap,
  LynxStackNavigationHelpers
> &
  StackRouterOptions;
