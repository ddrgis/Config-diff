import genDiff from '../src/';
import { getPathToFixtures, readFixtureFile } from './utils/utils';

const testInit = inputFormat => ({
  firstConfigPath: getPathToFixtures(`flatConfigs/before.${inputFormat}`),
  secondConfigPath: getPathToFixtures(`flatConfigs/after.${inputFormat}`),
  resultDiff: readFixtureFile('flatConfigs/diff.txt'),
});

test('correct pathToFlatJson input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('json');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct pathToFlatYaml input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('yaml');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct pathToFlatIni input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('ini');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct treelike JSON data input returns corrent diff json', () => {
  const firstConfig = getPathToFixtures('treelikeConfigs/before.json');
  const secondConfig = getPathToFixtures('treelikeConfigs/after.json');
  const resultDiff = readFixtureFile('treelikeConfigs/diff.txt');

  expect(genDiff(firstConfig, secondConfig)).toEqual(resultDiff);
});

test('correct treelike YAML data input returns corrent diff json', () => {
  const firstConfig = getPathToFixtures('treelikeConfigs/before.yaml');
  const secondConfig = getPathToFixtures('treelikeConfigs/after.yaml');
  const resultDiff = readFixtureFile('treelikeConfigs/diff.txt');

  expect(genDiff(firstConfig, secondConfig)).toEqual(resultDiff);
});

test('correct treelike INI data input returns corrent diff json', () => {
  const firstConfig = getPathToFixtures('treelikeConfigs/before.ini');
  const secondConfig = getPathToFixtures('treelikeConfigs/after.ini');
  const resultDiff = readFixtureFile('treelikeConfigs/diff.txt');

  expect(genDiff(firstConfig, secondConfig)).toEqual(resultDiff);
});
