import { getPathToFixtures } from './utils/utils';
import parseAST from '../src/ast';
import parseConfig from '../src/parser';
import { bigTreelikeAST, flatAST } from './utils/testData';

test('flat AST parsing', () => {
  const firstConfig = { host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22' };
  const secondConfig = { timeout: 20, verbose: true, host: 'hexlet.io' };

  expect(parseAST(firstConfig, secondConfig)).toEqual(flatAST);
});

const simpleTreelikeAST = [
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

test('simple treelike AST parsing (group1) from json', () => {
  const firstConfig = parseConfig(getPathToFixtures('treelikeConfigs/group1Before.json'));
  const secondConfig = parseConfig(getPathToFixtures('treelikeConfigs/group1After.json'));

  expect(parseAST(firstConfig, secondConfig)).toEqual(simpleTreelikeAST);
});

test('treelike ast parsing from json', () => {
  const firstConfig = parseConfig(getPathToFixtures('treelikeConfigs/before.json'));
  const secondConfig = parseConfig(getPathToFixtures('treelikeConfigs/after.json'));

  expect(parseAST(firstConfig, secondConfig)).toEqual(bigTreelikeAST);
});

test('treelike ast parsing from yaml', () => {
  const firstConfig = parseConfig(getPathToFixtures('treelikeConfigs/before.yaml'));
  const secondConfig = parseConfig(getPathToFixtures('treelikeConfigs/after.yaml'));

  expect(parseAST(firstConfig, secondConfig)).toEqual(bigTreelikeAST);
});

test('treelike ast parsing from ini', () => {
  const firstConfig = parseConfig(getPathToFixtures('treelikeConfigs/before.ini'));
  const secondConfig = parseConfig(getPathToFixtures('treelikeConfigs/after.ini'));

  expect(parseAST(firstConfig, secondConfig)).toEqual(bigTreelikeAST);
});
