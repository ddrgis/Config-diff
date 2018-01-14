import { readFixtureFile } from './utils/utils';
import render from '../src/render';

const flatAST = [
  {
    name: 'host', type: 'notChanged', newValue: 'hexlet.io',
  },
  {
    name: 'timeout', type: 'changed', newValue: 20, previousValue: 50,
  },
  {
    name: 'proxy', type: 'deleted', previousValue: '123.234.53.22',
  },
  {
    name: 'verbose', type: 'added', newValue: true,
  },
];

test('flat ast rendering to json', () => {
  const expectedResult = readFixtureFile('flatConfigs/diff.txt');

  expect(render(flatAST)).toBe(expectedResult);
});
