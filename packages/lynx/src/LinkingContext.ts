// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { ParamListBase } from '@react-navigation/core';
import * as React from 'react';

import type { LinkingOptions } from './types';

const MISSING_CONTEXT_ERROR = "Couldn't find a LinkingContext context.";

export const LinkingContext = React.createContext<{
  options?: LinkingOptions<ParamListBase>;
}>({
  get options(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

LinkingContext.displayName = 'LinkingContext';
