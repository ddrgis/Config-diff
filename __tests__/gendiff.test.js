import genDiff from '../src/';
import { getPathToFixtures, readFixtureFile } from './utils/utils';
import { bigTreelikeAST } from './utils/testData';

const testInit = inputFormat => ({
  firstConfigPath: getPathToFixtures(`flatConfigs/before.${inputFormat}`),
  secondConfigPath: getPathToFixtures(`flatConfigs/after.${inputFormat}`),
  resultDiff: readFixtureFile('flatConfigs/diff.txt'),
});

test('pathes to flat JSON data input return corrent StringFormat diff', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('json');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('pathes to flat Yaml data input return corrent StringFormat diff', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('yaml');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('pathes to flat JSON data input return corrent StringFormat diff', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('ini');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct path to treelike JSON data input returns corrent StringFormat diff', () => {
  const firstConfigPath = getPathToFixtures('treelikeConfigs/before.json');
  const secondConfigPath = getPathToFixtures('treelikeConfigs/after.json');
  const resultDiff = readFixtureFile('treelikeConfigs/diff.txt');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct path to treelike YAML data input returns corrent StringFormat diff', () => {
  const firstConfigPath = getPathToFixtures('treelikeConfigs/before.yaml');
  const secondConfigPath = getPathToFixtures('treelikeConfigs/after.yaml');
  const resultDiff = readFixtureFile('treelikeConfigs/diff.txt');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct path to reelike INI data input returns corrent StringFormat diff', () => {
  const firstConfigPath = getPathToFixtures('treelikeConfigs/before.ini');
  const secondConfigPath = getPathToFixtures('treelikeConfigs/after.ini');
  const resultDiff = readFixtureFile('treelikeConfigs/diff.txt');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct path to treelike JSON data input returns corrent diff in JSON format', () => {
  const firstConfigPath = getPathToFixtures('treelikeConfigs/before.json');
  const secondConfigPath = getPathToFixtures('treelikeConfigs/after.json');
  const resultDiff = bigTreelikeAST;

  expect(genDiff(firstConfigPath, secondConfigPath, 'json')).toEqual(resultDiff);
});
