---
'@react-navigation/lynx': patch
---

Declare `@types/react@>=19.2` as an optional peer dependency, so a consumer on `@types/react` 18 hears about it from the package manager instead of from a `Stack.Navigator cannot be used as a JSX component` error.
