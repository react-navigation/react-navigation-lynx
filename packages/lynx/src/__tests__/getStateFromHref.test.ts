import { expect, test } from 'vitest';

import { getStateFromHref } from '../getStateFromHref';

const config = {
  screens: {
    Home: '',
    Detail: 'detail/:id',
  },
};

test('parses an absolute path against the config', () => {
  expect(getStateFromHref('/detail/42', { config }, undefined)).toEqual({
    routes: [{ name: 'Detail', params: { id: '42' }, path: '/detail/42' }],
  });
});

test('strips a matching prefix before parsing', () => {
  expect(
    getStateFromHref('myapp://detail/7', { prefixes: ['myapp://'], config }, undefined)
  ).toEqual({
    routes: [{ name: 'Detail', params: { id: '7' }, path: '/detail/7' }],
  });
});

test('rejects a URL that no prefix matches', () => {
  expect(() =>
    getStateFromHref('other://detail/7', { prefixes: ['myapp://'], config }, undefined)
  ).toThrow("Got invalid href 'other://detail/7'");
});

test('rejects a URL the filter refuses', () => {
  expect(() =>
    getStateFromHref(
      'myapp://detail/7',
      { prefixes: ['myapp://'], config, filter: () => false },
      undefined
    )
  ).toThrow("doesn't match the filter");
});
