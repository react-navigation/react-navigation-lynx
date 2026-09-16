---
'@react-navigation/lynx': patch
---

Polyfill the builtins Lynx's JS engine doesn't implement. `@react-navigation/core`, `@react-navigation/routers` and `query-string` call `Array.prototype.findLast`, `findLastIndex` and `at`, `Object.hasOwn`, `String.prototype.replaceAll` and `queueMicrotask`, so navigating a stack crashed with `findLast is not a function`.
