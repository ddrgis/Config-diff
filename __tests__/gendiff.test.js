import fs from 'fs';
import path from 'path';
import { genDiff } from '../src/gendiff';

const readFixtureFile = fileName => fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8');

const getPathToFixtures = fileName => `./__tests__/__fixtures__/${fileName}`;

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
