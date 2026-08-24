import { useEffect, useState } from '@lynx-js/react';
import {
  BaseNavigationContainer,
  StackActions,
  useNavigation,
  usePreventRemove,
} from '@react-navigation/lynx';
import {
  createLynxStackNavigator,
  type LynxStackNavigationProp,
} from '@react-navigation/lynx/stack';

import { Button, colors, Readout, Screen } from './ui';

type StackParamList = {
  Home: undefined;
  Depth: { level: number };
  PreventRemove: undefined;
  Events: undefined;
  Preload: undefined;
  Detail: undefined;
};

const Stack = createLynxStackNavigator<StackParamList>();

type Nav = LynxStackNavigationProp<StackParamList>;

function useNav() {
  return useNavigation() as unknown as Nav;
}

export function App() {
  return (
    <page
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
      }}
    >
      <BaseNavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen
            name='Depth'
            component={DepthScreen}
            initialParams={{ level: 1 }}
          />
          <Stack.Screen name='PreventRemove' component={PreventRemoveScreen} />
          <Stack.Screen name='Events' component={EventsScreen} />
          <Stack.Screen name='Preload' component={PreloadScreen} />
          <Stack.Screen name='Detail' component={DetailScreen} />
        </Stack.Navigator>
      </BaseNavigationContainer>
    </page>
  );
}

const DEMOS: { route: keyof StackParamList; label: string; note: string }[] = [
  { route: 'Depth', label: 'Stack depth', note: 'push, popTo, popToTop' },
  {
    route: 'PreventRemove',
    label: 'Prevent remove',
    note: 'block the native dismiss, then let it through',
  },
  {
    route: 'Events',
    label: 'Transition events',
    note: 'transitionStart / transitionEnd',
  },
  { route: 'Preload', label: 'Preload', note: 'render a route before it is focused' },
];

function HomeScreen() {
  const navigation = useNav();

  return (
    <Screen title='Lynx stack' subtitle='React Navigation 8 on Lynx Screens'>
      {DEMOS.map((demo) => (
        <view key={demo.route}>
          <Button
            label={demo.label}
            // Each route here takes no params or has defaults, and `navigate`'s
            // overloads distribute over the union of route names rather than
            // accepting a plain string.
            onTap={() => (navigation.navigate as (screen: string) => void)(demo.route)}
          />
          <text
            style={{
              fontSize: '12px',
              color: colors.muted,
              marginTop: '4px',
              marginLeft: '4px',
            }}
          >
            {demo.note}
          </text>
        </view>
      ))}
    </Screen>
  );
}

/**
 * Pushing the same route repeatedly is the clearest way to see that the stack
 * keeps every entry alive and that `popTo` / `popToTop` land where they should.
 */
function DepthScreen({ route }: { route: { params?: { level?: number } } }) {
  const navigation = useNav();
  const level = route.params?.level ?? 1;
  const state = navigation.getState();

  return (
    <Screen
      title={`Level ${level}`}
      subtitle='Every level below stays mounted'
      background={level % 2 === 0 ? '#e8f0ff' : colors.background}
    >
      <Button
        label='Push another level'
        onTap={() =>
          navigation.dispatch(
            StackActions.push('Depth', { level: level + 1 })
          )
        }
      />
      <Button
        label='Pop to level 1'
        tone='plain'
        onTap={() => navigation.dispatch(StackActions.popTo('Depth', { level: 1 }))}
      />
      <Button
        label='Pop to top'
        tone='plain'
        onTap={() => navigation.dispatch(StackActions.popToTop())}
      />
      <Button label='Go back' tone='plain' onTap={() => navigation.goBack()} />
      <Readout
        lines={[
          `routes: ${state.routes.map((r) => r.name).join(' › ')}`,
          `index: ${state.index}`,
        ]}
      />
    </Screen>
  );
}

/**
 * The native side blocks the dismiss and reports it back; this listener is what
 * decides whether the route actually goes. Toggling the guard off and pressing
 * back again shows the same gesture succeeding.
 */
function PreventRemoveScreen() {
  const navigation = useNav();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [blockedCount, setBlockedCount] = useState(0);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    setBlockedCount((count) => count + 1);
    // A real app would confirm here. Discarding is the same one-liner:
    // navigation.dispatch(data.action)
    void data;
  });

  return (
    <Screen
      title='Prevent remove'
      subtitle='Press the hardware back button and watch the counter'
    >
      <Button
        label={hasUnsavedChanges ? 'Guard is on' : 'Guard is off'}
        tone={hasUnsavedChanges ? 'danger' : 'plain'}
        onTap={() => setHasUnsavedChanges((on) => !on)}
      />
      <Button label='Go back' tone='plain' onTap={() => navigation.goBack()} />
      <Readout
        lines={[
          `guard: ${hasUnsavedChanges ? 'blocking' : 'letting through'}`,
          `blocked attempts: ${blockedCount}`,
        ]}
      />
    </Screen>
  );
}

/** Screens emit transition events as the native stack animates them. */
function EventsScreen() {
  const navigation = useNav();
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const append = (entry: string) =>
      setLog((entries) => [entry, ...entries].slice(0, 6));

    const unsubscribeStart = navigation.addListener(
      'transitionStart',
      (e: { data: { closing: boolean } }) =>
        append(`transitionStart closing=${e.data.closing}`)
    );

    const unsubscribeEnd = navigation.addListener(
      'transitionEnd',
      (e: { data: { closing: boolean } }) =>
        append(`transitionEnd closing=${e.data.closing}`)
    );

    return () => {
      unsubscribeStart();
      unsubscribeEnd();
    };
  }, [navigation]);

  return (
    <Screen title='Transition events' subtitle='Push and pop to fill the log'>
      <Button
        label='Push a detail screen'
        onTap={() => navigation.navigate('Detail')}
      />
      <Button label='Go back' tone='plain' onTap={() => navigation.goBack()} />
      <Readout lines={log.length > 0 ? log : ['no events yet']} />
    </Screen>
  );
}

/**
 * A preloaded route renders while it is still detached, so its effects have
 * already run by the time it is navigated to.
 */
function PreloadScreen() {
  const navigation = useNav();
  const [preloaded, setPreloaded] = useState(false);

  return (
    <Screen title='Preload' subtitle='Render a route before it is focused'>
      <Button
        label='Preload the detail screen'
        onTap={() => {
          navigation.preload('Detail');
          setPreloaded(true);
        }}
      />
      <Button
        label='Navigate to it'
        tone='plain'
        onTap={() => navigation.navigate('Detail')}
      />
      <Button label='Go back' tone='plain' onTap={() => navigation.goBack()} />
      <Readout lines={[preloaded ? 'preloaded' : 'not preloaded yet']} />
    </Screen>
  );
}

function DetailScreen() {
  const navigation = useNav();
  const [mountedAt] = useState(() => Date.now());

  return (
    <Screen title='Detail' subtitle='Plain card screen' background='#fff6e5'>
      <Button label='Go back' tone='plain' onTap={() => navigation.goBack()} />
      <Readout lines={[`mounted at ${new Date(mountedAt).toLocaleTimeString()}`]} />
    </Screen>
  );
}
