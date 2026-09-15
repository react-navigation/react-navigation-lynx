// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import * as React from 'react';

import type { LocaleDirection } from './types';

export const LocaleDirContext = React.createContext<LocaleDirection>('ltr');

LocaleDirContext.displayName = 'LocaleDirContext';
