---
'@react-navigation/lynx': minor
---

Add deep linking. The host hands a route over in `initData.__navigation` for a cold start and emits a `reactnavigation.url` global event for later ones; everything downstream is `@react-navigation/core` unchanged.
