import {
  BaseNavigationContainer,
  useNavigation,
  usePreventRemove,
} from '@react-navigation/lynx';
import {
  createLynxStackNavigator,
  type LynxStackNavigationProp,
} from '@react-navigation/lynx/stack';

type StackParamList = {
  Home: undefined;
  Blue: undefined;
  Red: undefined;
};

const Stack = createLynxStackNavigator<StackParamList>();

export function App() {
  return (
    <page
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      }}
    >
      <BaseNavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Blue' component={BlueScreen} />
          {/* Refuses the native dismiss - hardware back should not pop this. */}
          <Stack.Screen name='Red' component={RedScreen} />
        </Stack.Navigator>
      </BaseNavigationContainer>
    </page>
  );
}

function Button({ label, onTap }: { label: string; onTap: () => void }) {
  return (
    <view
      style={{
        width: '220px',
        height: '48px',
        marginBottom: '12px',
        backgroundColor: '#2050ff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      bindtap={onTap}
    >
      <text style={{ color: 'white', fontSize: '16px' }}>{label}</text>
    </view>
  );
}

function Screen({
  title,
  backgroundColor,
  pushTargets,
  canGoBack,
}: {
  title: string;
  backgroundColor: string;
  pushTargets: (keyof StackParamList)[];
  canGoBack: boolean;
}) {
  const navigation =
    useNavigation() as unknown as LynxStackNavigationProp<StackParamList>;

  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,
      }}
    >
      <text
        style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}
      >
        {title}
      </text>
      {pushTargets.map((name) => (
        <Button
          key={name}
          label={`Push ${name}`}
          // Every route here takes no params, and `navigate`'s overloads
          // distribute over the union of route names rather than accepting a
          // plain string.
          onTap={() =>
            (navigation.navigate as (screen: string) => void)(name)
          }
        />
      ))}
      {canGoBack ? (
        <Button label='Go back' onTap={() => navigation.goBack()} />
      ) : null}
    </view>
  );
}

function HomeScreen() {
  return (
    <Screen
      title='Home'
      backgroundColor='#ffe14d'
      pushTargets={['Blue', 'Red']}
      canGoBack={false}
    />
  );
}

function BlueScreen() {
  return (
    <Screen
      title='Blue'
      backgroundColor='#8ad7ff'
      pushTargets={['Red']}
      canGoBack
    />
  );
}

function RedScreen() {
  // Blocks the native dismiss. The native side stops the gesture and reports
  // it back, and this listener is what keeps the route from being popped.
  usePreventRemove(true, () => {});

  return (
    <Screen
      title='Red (back is blocked)'
      backgroundColor='#ff8a8a'
      pushTargets={['Blue']}
      canGoBack
    />
  );
}
