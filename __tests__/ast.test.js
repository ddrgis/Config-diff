import fs from 'fs';
import path from 'path';
import { getPathToFixtures } from './utils/utils';
import parseAST from '../src/ast';
import parseConfig from '../src/parser';
import { bigTreelikeAST, flatAST } from './utils/testData';

const readFile = pathToFile => fs.readFileSync(path.resolve(process.env.PWD, pathToFile), 'utf-8');

const simpleTreelikeAST = [
  {
    name: 'group1',
    type: 'internalNode',
    children: [
      {
        name: 'baz', type: 'changed', newValue: 'bars', oldValue: 'bas',
      },
      {
        name: 'foo', type: 'notChanged', newValue: 'bar',
      },
    ],
  },
];

test('flat AST parsing from json', () => {
  const firstConfig = { host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22' };
  const secondConfig = { timeout: 20, verbose: true, host: 'hexlet.io' };

  expect(parseAST(firstConfig, secondConfig)).toEqual(flatAST);
});

test('simple treelike AST parsing (group1) from json', () => {
  const firstConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/group1Before.json')));
  const secondConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/group1After.json')));

  expect(parseAST(firstConfig, secondConfig)).toEqual(simpleTreelikeAST);
});

test('treelike ast parsing from json', () => {
  const firstConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/before.json')));
  const secondConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/after.json')));

  expect(parseAST(firstConfig, secondConfig)).toEqual(bigTreelikeAST);
});

test('treelike ast parsing from yaml', () => {
  const firstConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/before.yaml')), 'yaml');
  const secondConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/after.yaml')), 'yaml');

  expect(parseAST(firstConfig, secondConfig)).toEqual(bigTreelikeAST);
});

test('treelike ast parsing from ini', () => {
  const firstConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/before.ini')), 'ini');
  const secondConfig = parseConfig(readFile(getPathToFixtures('treelikeConfigs/after.ini')), 'ini');

  expect(parseAST(firstConfig, secondConfig)).toEqual(bigTreelikeAST);
});
