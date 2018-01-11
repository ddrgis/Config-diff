import fs from 'fs';
import path from 'path';
import { genDiff } from '../src/gendiff';

const readFixtureFile = fileName => fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8').replace(/"/g, '');

const getPathToFixtures = fileName => `./__tests__/__fixtures__/${fileName}`;

const testInit = inputFormat => ({
  firstConfigPath: getPathToFixtures(`before.${inputFormat}`),
  secondConfigPath: getPathToFixtures(`after.${inputFormat}`),
  resultDiff: readFixtureFile('diff.json'),
});

test('correct json input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('json');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct yaml input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('yaml');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct ini input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('ini');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});
