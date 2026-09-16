# `@react-navigation/lynx`

[![npm][npm-badge]][npm]
[![Apache-2.0 licensed][license-badge]][license]

[React Navigation](https://reactnavigation.org) for [Lynx](https://lynxjs.org).

This is the platform layer, the same role `@react-navigation/native` plays for
React Native: it owns what is Lynx-specific, re-exports
`@react-navigation/core` so an app has one import surface, and navigators sit
on top of it.

## Installation

```sh
npm install @react-navigation/lynx lynx-screens@next
```

`@lynx-js/react` and `lynx-screens` are peer dependencies. The stack navigator
renders through `lynx-screens`, so its native side has to be linked into the
host app as well.

`@lynx-js/react` has to be 0.126 or later, where `ref` reaches components as a
prop the way it does in React 19; `NavigationContainer` depends on that.

Lynx's JS engine is missing builtins that `@react-navigation/core`,
`@react-navigation/routers` and `query-string` call, so importing this package
installs conditional polyfills for `Array.prototype.findLast`, `findLastIndex`
and `at`, `Object.hasOwn`, `String.prototype.replaceAll` and `queueMicrotask`.

`@react-navigation/core` is written against React, so `react` has to resolve to
ReactLynx's compat entry, which adds `use`, `useInsertionEffect` and
`startTransition`:

```ts
// rsbuild.config.ts
resolve: {
  alias: {
    react$: require.resolve('@lynx-js/react/compat'),
  },
},
```

`use` works on the main thread from `@lynx-js/react` 0.126.1. On 0.126.0, alias
`react$` to `@react-navigation/lynx/react-compat` instead.

`@react-navigation/core` also lists `react` as a peer dependency, which the
alias above satisfies at build time but no package manager can see. pnpm's
default `auto-install-peers` papers over that; with `strict-peer-dependencies`
on, tell pnpm the peer is intentionally absent:

```yaml
# pnpm-workspace.yaml
peerDependencyRules:
  ignoreMissing: ['react']
```

The types are written against `@types/react` 19, so a TypeScript app needs
`@types/react@>=19.2` (declared as an optional peer).

## Usage

```tsx
import { createStaticNavigation } from '@react-navigation/lynx';
import { createLynxStackNavigator } from '@react-navigation/lynx/stack';

const Stack = createLynxStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Detail: DetailScreen,
  },
});

const Navigation = createStaticNavigation(Stack);

export function App() {
  return (
    <page>
      <Navigation />
    </page>
  );
}
```

`NavigationContainer` is exported too, for the dynamic API.

### Screen options

```tsx
const Stack = createLynxStackNavigator({
  screens: {
    Sheet: {
      screen: SheetScreen,
      options: {
        presentation: 'formSheet',
        contentStyle: { backgroundColor: '#fff' },
      },
    },
  },
});
```

`presentation` is `'card'` or `'formSheet'`. The navigator also emits
`transitionStart` and `transitionEnd`, each carrying `{ closing }`.

To stop a screen from being dismissed, use core's `usePreventRemove`:

```tsx
usePreventRemove(hasUnsavedChanges, ({ data }) => {
  confirm(() => navigation.dispatch(data.action));
});
```

## Deep linking

Path handling is `@react-navigation/core` unchanged: `config.screens` maps
paths onto route names and params, exactly as on React Native.

```tsx
import type { LinkingOptions } from '@react-navigation/lynx';

const linking: LinkingOptions<ParamList> = {
  config: {
    screens: {
      Home: '',
      Detail: 'detail/:id',
    },
  },
};

<Navigation linking={linking} />;
```

What is Lynx-specific is where the URL comes from. A card is not the process
that receives a link — the host app is — so the host has to hand it over.

**On a cold start**, the route rides in on `initData`, which the card can read
before any listener exists:

```kotlin
// Android
TemplateData.fromMap(mapOf(
  "__navigation" to mapOf(
    "route" to "/detail/42",
    "nonce" to System.currentTimeMillis(),
  ),
))
```

```swift
// iOS
LynxTemplateData(dictionary: [
  "__navigation": ["route": "/detail/42", "nonce": Date().timeIntervalSince1970],
])
```

`nonce` is required. `initData` is state, not an event: navigating to the same
route twice would leave the value untouched and the second one would be
dropped. Anything that changes per navigation works.

**Later routes** arrive as a global event carrying `{ url }`:

```kotlin
lynxView.sendGlobalEvent(
  "reactnavigation.url",
  JavaOnlyArray.of(JavaOnlyMap.from(mapOf("url" to "/detail/42"))),
)
```

```swift
lynxView.sendGlobalEvent("reactnavigation.url", withParams: [["url": "/detail/42"]])
```

The name is namespaced on purpose. React Native can afford the bare `url`
because `RCTLinkingManager` is its own emitter; Lynx's `GlobalEventEmitter` is
one namespace shared by the whole card and its host. A bare `url` event is
still accepted, so a host already emitting React Native's works unchanged.

The two channels are not interchangeable. A cold start cannot use the event —
no listener exists yet — and a warm one should not use `initData`, because
without a changing nonce a repeat route is invisible. A host that does both
will navigate twice.

The route may be a bare path (`/detail/42`), or a full URL if the app sets
`prefixes`. Prefix stripping matches React Native, wildcards included:

```tsx
const linking: LinkingOptions<ParamList> = {
  prefixes: ['myapp://', 'https://*.example.com'],
  config: { screens: { Detail: 'detail/:id' } },
};
```

`getInitialURL`, `subscribe`, `getStateFromPath`, `getActionFromState` and
`filter` are all replaceable, the same as on React Native.

### Reading it directly

`getInitialURL()` returns the launch route and is **synchronous** — React
Native has to await `Linking.getInitialURL()`, but on Lynx `initData` is
already in hand when the card starts, so the first render lands on the right
route instead of on the fallback.

```tsx
import { getInitialURL, subscribe } from '@react-navigation/lynx';
```

## Example

A runnable app lives in
[`examples/stack`](https://github.com/react-navigation/react-navigation-lynx/tree/main/examples/stack);
the [repository README](https://github.com/react-navigation/react-navigation-lynx#example)
explains how to run it.

## Differences from `@react-navigation/native`

- No `Link`, `useLinkTo`, `useLinkBuilder` or `useRoutePath` yet: only the
  URL-to-navigation direction is implemented.
- No state persistence, and no container-level back-button handling — the
  native stack owns dismissal per screen, so a container handler would fight
  with it.
- `getInitialURL` is synchronous, as above.

## License

Licensed under the [Apache License 2.0](LICENSE). Files ported from React
Navigation keep their original MIT notice.

[npm-badge]: https://img.shields.io/npm/v/@react-navigation/lynx.svg
[npm]: https://www.npmjs.com/package/@react-navigation/lynx
[license-badge]: https://img.shields.io/badge/License-Apache--2.0-cyan?logo=apache
[license]: LICENSE
