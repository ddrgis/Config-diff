import jestTesting from '../src/jestTesting';

test('test1', () => {
  expect(jestTesting(2)).toBe(4);
});