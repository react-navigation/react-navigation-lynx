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

import escapeStringRegexp from 'escape-string-regexp';

import type { LinkingPrefix } from './types';

/** Verbatim from `@react-navigation/native`, which cannot be imported here. */
export function extractPathFromURL(prefixes: LinkingPrefix[], url: string) {
  for (const prefix of prefixes) {
    let prefixRegex;

    if (prefix === '*') {
      prefixRegex = /^(((https?:\/\/)[^/]+)|([^/]+:(\/\/)?))/;
    } else {
      const protocol = prefix.match(/^[^:]+:/)?.[0] ?? '';
      const host = prefix
        .replace(new RegExp(`^${escapeStringRegexp(protocol)}`), '')
        .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
        .replace(/^\//, ''); // Remove extra leading slash

      prefixRegex = new RegExp(
        `^${escapeStringRegexp(protocol)}(/)*${host
          .split('.')
          .map((it) => (it === '*' ? '[^/?#]+' : escapeStringRegexp(it)))
          .join('\\.')}${
          host === '' || host.endsWith('/') ? '' : '(?=$|[/?#])'
        }`
      );
    }

    const [originAndPath = '', ...searchParams] = url.split('?');

    if (prefixRegex.test(originAndPath)) {
      const result = originAndPath
        .replace(prefixRegex, '')
        .replace(/\/+/g, '/')
        .concat(searchParams.length ? `?${searchParams.join('?')}` : '');

      return result.startsWith('/') ? result : `/${result}`;
    }
  }

  return undefined;
}
