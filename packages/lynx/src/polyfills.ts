// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

type Predicate<T> = (value: T, index: number, array: T[]) => boolean;

function define(target: object, name: string, value: unknown) {
  Object.defineProperty(target, name, {
    value,
    configurable: true,
    writable: true,
  });
}

if (typeof Array.prototype.findLast !== 'function') {
  define(Array.prototype, 'findLast', function<T>(
    this: T[],
    predicate: Predicate<T>,
    thisArg?: unknown
  ) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, this[i] as T, i, this)) {
        return this[i];
      }
    }

    return undefined;
  });
}

if (typeof Array.prototype.findLastIndex !== 'function') {
  define(Array.prototype, 'findLastIndex', function<T>(
    this: T[],
    predicate: Predicate<T>,
    thisArg?: unknown
  ) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, this[i] as T, i, this)) {
        return i;
      }
    }

    return -1;
  });
}

if (typeof Array.prototype.at !== 'function') {
  define(Array.prototype, 'at', function<T>(this: T[], index: number) {
    const i = Math.trunc(index) || 0;

    return this[i < 0 ? this.length + i : i];
  });
}

if (typeof Object.hasOwn !== 'function') {
  define(Object, 'hasOwn', function(target: object, key: PropertyKey) {
    return Object.prototype.hasOwnProperty.call(target, key);
  });
}

if (typeof String.prototype.replaceAll !== 'function') {
  define(String.prototype, 'replaceAll', function(
    this: string,
    pattern: string | RegExp,
    replacement: string | ((...args: string[]) => string)
  ) {
    if (pattern instanceof RegExp) {
      if (!pattern.global) {
        throw new TypeError(
          'replaceAll must be called with a global RegExp'
        );
      }

      return this.replace(pattern, replacement as string);
    }

    const escaped = String(pattern).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return this.replace(new RegExp(escaped, 'g'), replacement as string);
  });
}

const globals = globalThis as {
  queueMicrotask?: (callback: () => void) => void;
};

if (typeof globals.queueMicrotask !== 'function') {
  globals.queueMicrotask = (callback: () => void) => {
    Promise.resolve().then(callback);
  };
}
