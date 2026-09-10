import { NavigationRootContext } from '@react-navigation/core';
import * as React from 'react';

import { useBuildAction } from './useLinkBuilder';

export function useLinkTo() {
  const navigation = React.use(NavigationRootContext);

  if (navigation === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }

  const buildAction = useBuildAction();

  const linkTo = React.useCallback(
    (href: string) => {
      const action = buildAction(href);

      navigation.dispatch(action);
    },
    [buildAction, navigation]
  );

  return linkTo;
}
