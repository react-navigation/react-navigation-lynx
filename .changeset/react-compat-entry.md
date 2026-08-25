---
"@react-navigation/lynx": minor
---

Export the compat layer as `@react-navigation/lynx/react-compat`.

Every app has to alias `react` onto it - `@react-navigation/core` is written
against React, and this fills what ReactLynx does not have yet. Until now the
only way to reach it was a path into the package's `src/`.
