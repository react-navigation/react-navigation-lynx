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
