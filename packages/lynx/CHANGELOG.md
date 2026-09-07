# @react-navigation/lynx

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
