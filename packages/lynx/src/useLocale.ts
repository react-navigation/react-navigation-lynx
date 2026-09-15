// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import * as React from 'react';

import { LocaleDirContext } from './LocaleDirContext';

export function useLocale() {
  const direction = React.use(LocaleDirContext);

  if (direction === undefined) {
    throw new Error(
      "Couldn't determine the text direction. Is your component inside NavigationContainer?"
    );
  }

  return { direction };
}
