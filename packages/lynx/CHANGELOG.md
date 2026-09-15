# @react-navigation/lynx

## 0.4.2

### Patch Changes

- License the package under Apache-2.0, and ship the license text with it. ([#24](https://github.com/react-navigation/react-navigation-lynx/pull/24))

## 0.4.1

### Patch Changes

- Require `lynx-screens@>=0.1.0-alpha.1`. The peer was `*`, so npm and pnpm auto-installed `lynx-screens@latest` (0.0.1), which predates Stack v5. ([#22](https://github.com/react-navigation/react-navigation-lynx/pull/22))

## 0.4.0

### Minor Changes

- Render `presentation: 'formSheet'` routes. The option was accepted by the types and then thrown on, so it was unusable. Sheets render through `FormSheetNativeComponent` as siblings of the stack host, open and close with focus, and report the detent they settle at as a `sheetDetentChange` event. The option names follow `@react-navigation/native-stack`. ([#16](https://github.com/react-navigation/react-navigation-lynx/pull/16))

- Line the root export up with `@react-navigation/native`: `LinkingContext`, `LocaleDirContext` and `useLocale` (with a `direction` prop on `NavigationContainer`), `useLinkTo`, `useLinkBuilder`, `useRoutePath`, the Material fallback themes, and every type from `types`. `@react-navigation/lynx/stack` now exports `LynxStackView` and `LynxStackOptionsArgs` like `native-stack` does, and no longer exports the descriptor and helper types that `native-stack` keeps internal. ([#19](https://github.com/react-navigation/react-navigation-lynx/pull/19))

### Patch Changes

- Declare `@types/react@>=19.2` as an optional peer dependency, so a consumer on `@types/react` 18 hears about it from the package manager instead of from a `Stack.Navigator cannot be used as a JSX component` error. ([#21](https://github.com/react-navigation/react-navigation-lynx/pull/21))

## 0.3.0

### Minor Changes

- Add deep linking. The host hands a route over in `initData.__navigation` for a cold start and emits a `reactnavigation.url` global event for later ones; everything downstream is `@react-navigation/core` unchanged. ([#9](https://github.com/react-navigation/react-navigation-lynx/pull/9))

### Patch Changes

- Add a README, so the published package documents installation, the stack navigator and the host side of deep linking. ([#12](https://github.com/react-navigation/react-navigation-lynx/pull/12))

- Drop the context bridge the container used to reach its own imperative handle. ReactLynx 0.126 moves to Preact 11, where a ref on a function component arrives as a prop the way React 19 delivers it, so `useLinking` can take the ref directly. ([#10](https://github.com/react-navigation/react-navigation-lynx/pull/10))

## 0.2.0

### Minor Changes

- Export the compat layer as `@react-navigation/lynx/react-compat`. ([#6](https://github.com/react-navigation/react-navigation-lynx/pull/6))
  
  Every app has to alias `react` onto it - `@react-navigation/core` is written
  against React, and this fills what ReactLynx does not have yet. Until now the
  only way to reach it was a path into the package's `src/`.

## 0.1.0

### Minor Changes

- Stack navigator for Lynx, built on React Navigation 8 and Lynx Screens. ([#1](https://github.com/react-navigation/react-navigation-lynx/pull/1))
  
  `@react-navigation/lynx` is the platform layer - it re-exports core and owns
  `NavigationContainer` and `createStaticNavigation` - and the stack navigator
  lives at `@react-navigation/lynx/stack`. Card presentation only for now; form
  sheet needs form sheet support in lynx-screens.
