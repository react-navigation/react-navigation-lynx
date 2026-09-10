# react-navigation-lynx

Routing and navigation for [Lynx](https://lynxjs.org) apps, built on
[React Navigation](https://reactnavigation.org).

## Layout

```
react-navigation/   git submodule - upstream React Navigation
lynx-screens/       git submodule - native screen primitives
packages/lynx/      @react-navigation/lynx
```

Both dependencies are vendored as submodules rather than consumed from npm.
React Navigation 8 and Lynx Screens 5 are both moving quickly, and this package
has to track them closely enough that waiting on releases would stall it.

`@react-navigation/core` resolves to its TypeScript source through the
`@react-navigation/source` export condition, the same way the upstream monorepo
resolves its own packages, so neither submodule needs a build step.

## Structure

`@react-navigation/lynx` mirrors what `@react-navigation/native` does for React
Native: it is the platform layer, it re-exports core so apps have a single
import surface, and navigators sit on top of it rather than on core directly.

- `.` - platform layer
- `./stack` - stack navigator, backed by `lynx-screens`

## Development

```sh
pnpm install
pnpm test
pnpm typecheck
```

The vendored `@react-navigation/core` and `@react-navigation/routers` are
consumed through their normal `exports`, like the published packages, so their
`lib/` has to exist: `pnpm build:vendored` builds it (`turbo run prepack`), and
the turbo tasks depend on it, so `pnpm typecheck`, `pnpm test`, `pnpm dev` and
`pnpm build` rebuild it whenever the submodules change.

`typecheck` reports diagnostics from the vendored sources but only fails on
this package's own. Those sources are written against React's types while this
package maps `react` onto ReactLynx, so inference inside them degrades; each
submodule typechecks itself with its own config.
