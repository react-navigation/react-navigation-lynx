/**
 * The Lynx half of React Navigation's linking: a card is not the process that
 * receives the URL, so the host hands it over either through
 * `initData.__navigation` or through a global event.
 */

export const INIT_DATA_KEY = '__navigation';

/**
 * Namespaced, unlike React Native's bare `url`: `GlobalEventEmitter` is one
 * namespace shared by the whole card and its host.
 */
export const URL_EVENT = 'reactnavigation.url';

export const RN_URL_EVENT = 'url';

export type NavigationInitData = {
  route?: string | undefined;
  /** Anything that changes per navigation; see `subscribe`. */
  nonce?: string | number | undefined;
};

type GlobalEventEmitter = {
  addListener: (event: string, listener: (...args: any[]) => void) => void;
  removeListener: (event: string, listener: (...args: any[]) => void) => void;
};

const DATA_CHANGED_EVENT = 'onDataChanged';

function readNavigationInitData(): NavigationInitData | undefined {
  const initData = (lynx as { __initData?: Record<string, unknown> }).__initData;
  return initData?.[INIT_DATA_KEY] as NavigationInitData | undefined;
}

function getEmitter(): GlobalEventEmitter | undefined {
  // Background thread only, and absent under test renderers.
  return lynx.getJSModule?.('GlobalEventEmitter') as
    | GlobalEventEmitter
    | undefined;
}

/**
 * Synchronous, unlike React Native's `Linking.getInitialURL()`, so the first
 * render already lands on the right route.
 */
export function getInitialURL(): string | undefined {
  return readNavigationInitData()?.route;
}

export function subscribe(listener: (url: string) => void): () => void {
  const emitter = getEmitter();

  if (!emitter) {
    return () => {};
  }

  let lastSeen = readNavigationInitData()?.nonce ?? getInitialURL();

  const onDataChanged = () => {
    const next = readNavigationInitData();

    if (!next?.route) {
      return;
    }

    // initData is state, not an event: without the nonce, navigating to the
    // same route twice would leave it untouched and be dropped.
    const marker = next.nonce ?? next.route;

    if (marker === lastSeen) {
      return;
    }

    lastSeen = marker;
    listener(next.route);
  };

  // `sendGlobalEvent(name, JavaOnlyArray)` reaches JS as either the array's
  // first element or the array itself, and a host may send a bare string.
  const onUrl = (payload: unknown) => {
    const first = Array.isArray(payload) ? payload[0] : payload;
    const url =
      typeof first === 'string'
        ? first
        : (first as { url?: string } | undefined)?.url;

    if (url) {
      listener(url);
    }
  };

  emitter.addListener(DATA_CHANGED_EVENT, onDataChanged);
  emitter.addListener(URL_EVENT, onUrl);
  emitter.addListener(RN_URL_EVENT, onUrl);

  return () => {
    emitter.removeListener(DATA_CHANGED_EVENT, onDataChanged);
    emitter.removeListener(URL_EVENT, onUrl);
    emitter.removeListener(RN_URL_EVENT, onUrl);
  };
}
