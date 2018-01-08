/* eslint-disable */
import parse from '../src/commandParser';

test('Parsed result is object', () => {
  expect(typeof parse()).toBe('object');
});