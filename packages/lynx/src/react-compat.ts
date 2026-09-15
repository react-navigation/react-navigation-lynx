// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

// ReactLynx is Preact-based and does not implement every hook that
// `@react-navigation/core` imports from `react`. The Lynx build aliases
// `react` to this module (runtime alias in the bundler config, `paths` in
// tsconfig) so those imports link and both sides share one set of types.
//
// Tracking the gaps, counted against core's runtime source:
//
// - `use` (4 files): every call site passes a Context, never a promise, so
//   `useContext` is a faithful stand-in today. Preact 11 ships the real one.
// - `startTransition` / `useTransition` (2 files): ReactLynx keeps these on
//   its compat entry rather than the main one.
// - `useInsertionEffect` (15 files): no equivalent. `useLayoutEffect` is
//   close but not equal - insertion effects run before layout effects, and
//   layout effects run bottom-up, so a parent writing a ref in an insertion
//   effect is guaranteed fresh when a child's layout effect reads it. Twelve
//   of the fifteen are plain latest-ref writes where that gap is invisible;
//   `useRegisterNavigator`, `usePreventRemove` and `PreventRemoveProvider`
//   also register cleanups, and those are the ones to watch.
import * as ReactLynx from '@lynx-js/react';
import { useContext, useLayoutEffect } from '@lynx-js/react';
import { startTransition, useTransition } from '@lynx-js/react/compat';

export * from '@lynx-js/react';
export { startTransition, useTransition };

export const use = useContext;
export const useInsertionEffect = useLayoutEffect;

// `@lynx-js/react` declares no default export. Build one that keeps every
// generic signature intact, otherwise `import React from 'react'` degrades to
// `any` and callers lose inference (e.g. `React.useState` setter callbacks).
const React = {
  ...ReactLynx,
  use,
  useInsertionEffect,
  startTransition,
  useTransition,
};

export default React;
