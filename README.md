# React Navigation for Lynx

[![CI][ci-badge]][ci]
[![npm][npm-badge]][npm]
[![Apache-2.0 licensed][license-badge]][license]

Routing and navigation for [Lynx](https://lynxjs.org) apps, built on
[React Navigation](https://reactnavigation.org).

Documentation lives in the [`@react-navigation/lynx` README](packages/lynx#readme).

## Package Versions

| Name                                    |                                                      Latest Version                                                      |
| --------------------------------------- | :----------------------------------------------------------------------------------------------------------------------: |
| [@react-navigation/lynx](packages/lynx) | [![badge](https://img.shields.io/npm/v/@react-navigation/lynx.svg)](https://www.npmjs.com/package/@react-navigation/lynx) |

The stack navigator renders through
[`lynx-screens`](https://github.com/software-mansion-labs/lynx-screens), a peer
dependency that is published under the `next` tag for now:
[![badge](https://img.shields.io/npm/v/lynx-screens/next.svg)](https://www.npmjs.com/package/lynx-screens).

## Example

[`examples/stack`](examples/stack) exercises the stack navigator, form sheets
and deep linking. It needs a host app with the native side of `lynx-screens`
linked in, so it runs inside the example app that ships with `lynx-screens`
rather than in Lynx Explorer.

1. Build and launch `lynx-screens/LynxExample` on Android or iOS, following
   [lynx-screens' getting started](https://github.com/software-mansion-labs/lynx-screens#getting-started).
2. Start the dev server:

   ```sh
   git submodule update --init
   pnpm install
   pnpm turbo run dev --filter @react-navigation/example-stack
   ```

3. On the host's home screen, scan the QR code the dev server prints, or enter
   its URL.

## Layout

```
react-navigation/   git submodule - upstream React Navigation
lynx-screens/       git submodule - native screen primitives
packages/lynx/      @react-navigation/lynx
examples/stack/     example app
```

Both dependencies are vendored as submodules rather than consumed from npm.
React Navigation 8 and `lynx-screens` are both moving quickly, and this package
has to track them closely enough that waiting on releases would stall it.

## Structure

`@react-navigation/lynx` mirrors what `@react-navigation/native` does for React
Native: it is the platform layer, it re-exports core so apps have a single
import surface, and navigators sit on top of it rather than on core directly.

- `.` - platform layer
- `./stack` - stack navigator, backed by `lynx-screens`
- `./react-compat` - the `react` entry for the bundler alias

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

## License

Licensed under the [Apache License 2.0](LICENSE). Files ported from React
Navigation keep their original MIT notice.

[ci-badge]: https://github.com/react-navigation/react-navigation-lynx/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/react-navigation/react-navigation-lynx/actions/workflows/ci.yml
[npm-badge]: https://img.shields.io/npm/v/@react-navigation/lynx.svg
[npm]: https://www.npmjs.com/package/@react-navigation/lynx
[license-badge]: https://img.shields.io/badge/License-Apache--2.0-cyan?logo=apache
[license]: LICENSE
