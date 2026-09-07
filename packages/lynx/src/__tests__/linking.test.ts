import { getStateFromPath } from '@react-navigation/core';
import { afterEach, expect, test, vi } from 'vitest';

import {
  getInitialURL,
  INIT_DATA_KEY,
  RN_URL_EVENT,
  subscribe,
  URL_EVENT,
} from '../linking';

type Listener = (...args: any[]) => void;

/** Stands in for `lynx.__initData` and `GlobalEventEmitter`. */
function setupLynx(initNavigation?: Record<string, unknown>) {
  const listeners = new Map<string, Set<Listener>>();

  const emitter = {
    addListener: (event: string, listener: Listener) => {
      const set = listeners.get(event) ?? new Set();
      set.add(listener);
      listeners.set(event, set);
    },
    removeListener: (event: string, listener: Listener) => {
      listeners.get(event)?.delete(listener);
    },
  };

  const lynx = {
    __initData: initNavigation
      ? { [INIT_DATA_KEY]: initNavigation }
      : ({} as Record<string, unknown>),
    getJSModule: (name: string) =>
      name === 'GlobalEventEmitter' ? emitter : undefined,
  };

  vi.stubGlobal('lynx', lynx);

  return {
    /** What the host does on `updateMetaData`. */
    updateInitData(navigation: Record<string, unknown>) {
      lynx.__initData = { [INIT_DATA_KEY]: navigation };
      listeners.get('onDataChanged')?.forEach((l) => l());
    },
    emitUrl(url: string, event: string = URL_EVENT) {
      listeners.get(event)?.forEach((l) => l({ url }));
    },
    listenerCount: (event: string) => listeners.get(event)?.size ?? 0,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test('reads the launch route out of initData', () => {
  setupLynx({ route: '/users/42?tab=posts' });

  expect(getInitialURL()).toBe('/users/42?tab=posts');
});

test('reports no launch route when the host set none', () => {
  setupLynx();

  expect(getInitialURL()).toBeUndefined();
});

test('an initData update delivers the new route', () => {
  const host = setupLynx({ route: '/', nonce: 1 });
  const listener = vi.fn();

  subscribe(listener);
  host.updateInitData({ route: '/settings', nonce: 2 });

  expect(listener).toHaveBeenCalledWith('/settings');
});

test('the route the card started with is not delivered again', () => {
  const host = setupLynx({ route: '/users/42', nonce: 1 });
  const listener = vi.fn();

  subscribe(listener);
  // An unrelated initData change - a data refresh, say - must not re-navigate.
  host.updateInitData({ route: '/users/42', nonce: 1 });

  expect(listener).not.toHaveBeenCalled();
});

test('navigating twice to the same route works when the nonce moves', () => {
  const host = setupLynx({ route: '/', nonce: 1 });
  const listener = vi.fn();

  subscribe(listener);
  host.updateInitData({ route: '/users/42', nonce: 2 });
  host.updateInitData({ route: '/users/42', nonce: 3 });

  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenNthCalledWith(2, '/users/42');
});

test('a url event delivers the route', () => {
  const host = setupLynx();
  const listener = vi.fn();

  subscribe(listener);
  host.emitUrl('/settings');

  expect(listener).toHaveBeenCalledWith('/settings');
});

test('the event name is namespaced, since GlobalEventEmitter is shared', () => {
  expect(URL_EVENT).toBe('reactnavigation.url');
});

test('still accepts the bare `url` event React Native hosts emit', () => {
  const host = setupLynx();
  const listener = vi.fn();

  subscribe(listener);
  host.emitUrl('/settings', RN_URL_EVENT);

  expect(listener).toHaveBeenCalledWith('/settings');
});

test('unsubscribing detaches every listener', () => {
  const host = setupLynx({ route: '/' });

  const unsubscribe = subscribe(vi.fn());

  expect(host.listenerCount('onDataChanged')).toBe(1);
  expect(host.listenerCount(URL_EVENT)).toBe(1);
  expect(host.listenerCount(RN_URL_EVENT)).toBe(1);

  unsubscribe();

  expect(host.listenerCount('onDataChanged')).toBe(0);
  expect(host.listenerCount(URL_EVENT)).toBe(0);
  expect(host.listenerCount(RN_URL_EVENT)).toBe(0);
});

test('survives a host that offers no GlobalEventEmitter', () => {
  vi.stubGlobal('lynx', { __initData: {} });

  expect(() => subscribe(vi.fn())()).not.toThrow();
});

test('the route it produces is what core turns into navigation state', () => {
  setupLynx({ route: '/users/42?tab=posts' });

  const state = getStateFromPath(getInitialURL()!, {
    screens: { Home: '', Profile: 'users/:id' },
  });

  expect(state).toEqual({
    routes: [
      {
        name: 'Profile',
        params: { id: '42', tab: 'posts' },
        path: '/users/42?tab=posts',
      },
    ],
  });
});
