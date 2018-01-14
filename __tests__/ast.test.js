import { getPathToFixtures } from './utils/utils';
import parseAST from '../src/ast';
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

const bigTreelikeAST = [
  {
    name: 'common',
    type: 'internalNode',
    children: [
      { name: 'setting1', type: 'notChanged', newValue: 'Value 1' },
      { name: 'setting2', type: 'deleted', previousValue: '200' },
      { name: 'setting3', type: 'notChanged', newValue: true },
      {
        name: 'setting6',
        type: 'internalNode',
        children: [
          { name: 'key', type: 'notChanged', newValue: 'value' },
          { name: 'ops', type: 'added', newValue: 'vops' },
        ],
      },
      { name: 'setting4', type: 'added', newValue: 'blah blah' },
      {
        name: 'setting5', type: 'added', newValue: { key5: 'value5' },
      },
    ],
  },
  {
    name: 'group1',
    type: 'internalNode',
    children: [
      {
        name: 'baz',
        type: 'changed',
        newValue: 'bars',
        previousValue: 'bas',
      },
      {
        name: 'foo',
        type: 'notChanged',
        newValue: 'bar',
      },
    ],
  },
  {
    name: 'group2',
    type: 'deleted',
    previousValue: { abc: '12345' },
  },
  {
    name: 'group3',
    type: 'added',
    newValue: { fee: '100500' },
  },
];

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

