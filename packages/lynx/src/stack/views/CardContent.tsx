// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { ReactNode } from '@lynx-js/react';

import type { LynxStackDescriptor } from '../types';

type Props = {
  descriptor: LynxStackDescriptor;
  activityMode: 'normal' | 'inert' | 'paused' | 'unmounted';
  backgroundColor: string;
};

export function CardContent({
  descriptor,
  activityMode,
  backgroundColor,
}: Props) {
  const { options, render } = descriptor;

  const { contentStyle } = options;

  let contentElement: ReactNode;

  if (activityMode === 'unmounted') {
    contentElement = null;
  } else {
    contentElement = (
      <view
        user-interaction-enabled={activityMode !== 'inert'}
        style={styles.content}
      >
        {render()}
      </view>
    );
  }

  return (
    <view style={{ ...styles.container, backgroundColor, ...contentStyle }}>
      {contentElement}
    </view>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
} as const;
