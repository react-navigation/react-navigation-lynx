---
'@react-navigation/lynx': patch
---

Bring back three things the Lynx stack left out of `@react-navigation/native-stack`: pressing the focused tab of a parent tab navigator pops the stack to its top, a route pushed above a `formSheet` or a sheet replacing another sheet throws a descriptive error, and a screen removed natively but kept in JS state logs an error in development.
