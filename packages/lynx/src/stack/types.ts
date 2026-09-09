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
  /**
   * Heights the sheet can rest at, as fractions of the screen, or
   * `'fitToContents'` to measure the content. `formSheet` only, as is every
   * option below. Names follow `@react-navigation/native-stack`.
   */
  sheetAllowedDetents?: number[] | 'fitToContents' | undefined;
  sheetInitialDetentIndex?: number | 'last' | undefined;
  /** Detents up to this one leave the content behind the sheet undimmed. */
  sheetLargestUndimmedDetentIndex?: number | 'none' | 'last' | undefined;
  sheetGrabberVisible?: boolean | undefined;
  sheetCornerRadius?: number | 'systemDefault' | undefined;
  sheetExpandsWhenScrolledToEdge?: boolean | undefined;
};

export type LynxStackNavigationEventMap = {
  transitionStart: { data: { closing: boolean } };
  transitionEnd: { data: { closing: boolean } };
  /** The detent a `formSheet` settled at, as an index into its detents. */
  sheetDetentChange: { data: { index: number } };
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
