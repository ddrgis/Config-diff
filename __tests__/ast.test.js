import { readFixtureFile, getPathToFixtures } from './utils/utils';
import parseAST, { render } from '../src/ast';
import parseConfig from '../src/parser';

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

  expect(parseAST(firstConfig, secondConfig)).toEqual(flatAST);
});

test('flat ast rendering to json', () => {
  const expectedResult = readFixtureFile('flatConfigs/diff.txt');

  expect(render(flatAST)).toBe(expectedResult);
});

const treelikeAST = [
  {
    name: 'group1',
    type: 'internalNode',
    children: [
      {
        name: 'baz', type: 'changed', newValue: 'bars', previousValue: 'bas',
      },
      {
        name: 'foo', type: 'notChanged', newValue: 'bar',
      },
    ],
  },
];

test('simple treelike AST parsing (group1)', () => {
  const firstConfig = parseConfig(getPathToFixtures('treelikeConfigs/group1Before.json'));
  const secondConfig = parseConfig(getPathToFixtures('treelikeConfigs/group1After.json'));

  expect(parseAST(firstConfig, secondConfig)).toEqual(treelikeAST);
});
