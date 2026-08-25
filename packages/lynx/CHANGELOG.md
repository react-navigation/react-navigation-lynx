# @react-navigation/lynx

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
