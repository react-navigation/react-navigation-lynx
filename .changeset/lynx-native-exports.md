---
'@react-navigation/lynx': minor
---

Line the root export up with `@react-navigation/native`: `LinkingContext`, `LocaleDirContext` and `useLocale` (with a `direction` prop on `NavigationContainer`), `useLinkTo`, `useLinkBuilder`, `useRoutePath`, the Material fallback themes, and every type from `types`. `@react-navigation/lynx/stack` now exports `LynxStackView` and `LynxStackOptionsArgs` like `native-stack` does, and no longer exports the descriptor and helper types that `native-stack` keeps internal.
