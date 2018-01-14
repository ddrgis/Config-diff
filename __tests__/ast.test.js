import { readFixtureFile } from './utils/utils';
import parse, { render } from '../src/ast';

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

test('flat AST parsing', () => {
  const firstConfig = { host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22' };
  const secondConfig = { timeout: 20, verbose: true, host: 'hexlet.io' };

  expect(parse(firstConfig, secondConfig)).toEqual(flatAST);
});

test('flat ast rendering to json', () => {
  const expectedResult = readFixtureFile('flatConfigs/diff.txt');

  expect(render(flatAST)).toBe(expectedResult);
});
