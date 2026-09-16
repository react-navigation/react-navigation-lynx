---
'@react-navigation/lynx': patch
---

Keep a popped card screen rendered while it animates out, so going back with `navigation.goBack()` slides the screen away instead of dropping it at once. Inactive card screens now follow the new `inactiveBehavior` option, which defaults to `pause` and keeps them mounted.
