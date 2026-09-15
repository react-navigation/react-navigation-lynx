// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

/**
 * @license
MIT License

Copyright (c) 2017 React Navigation Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import type { LynxTheme } from '../types';

import { fonts } from './fonts';

/** Same palette as `@react-navigation/native`'s Material fallback themes. */
export const MaterialLightFallbackTheme = {
  dark: false,
  colors: {
    primary: '#6750a4',
    background: '#f3edf7',
    card: '#fef7ff',
    text: '#1d1b20',
    border: '#cac4d0',
    notification: '#ba1a1a',
  },
  fonts,
} as const satisfies LynxTheme;

export const MaterialDarkFallbackTheme = {
  dark: true,
  colors: {
    primary: '#d0bcff',
    background: '#211f26',
    card: '#141218',
    text: '#e6e0e9',
    border: '#49454f',
    notification: '#ffb4ab',
  },
  fonts,
} as const satisfies LynxTheme;
