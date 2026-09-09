---
'@react-navigation/lynx': minor
---

Render `presentation: 'formSheet'` routes. The option was accepted by the types and then thrown on, so it was unusable. Sheets render through `FormSheetNativeComponent` as siblings of the stack host, open and close with focus, and report the detent they settle at as a `sheetDetentChange` event. The option names follow `@react-navigation/native-stack`.
