import fs from 'fs';
import path from 'path';
import genDiff from '../src/';

const readFixtureFile = fileName => fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8');
const getPathToFixtures = fileName => `./__tests__/__fixtures__/${fileName}`;
const testInit = (inputFormat, fixturesSubDir) => ({
  firstConfigPath: getPathToFixtures(`${fixturesSubDir}/before.${inputFormat}`),
  secondConfigPath: getPathToFixtures(`${fixturesSubDir}/after.${inputFormat}`),
  resultDiff: readFixtureFile(`${fixturesSubDir}/diff.txt`),
});

test('correct pathToFlatJson input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('json', 'flatConfigs');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct pathToFlatYaml input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('yaml', 'flatConfigs');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

test('correct pathToFlatIni input returns corrent diff json', () => {
  const { firstConfigPath, secondConfigPath, resultDiff } = testInit('ini', 'flatConfigs');

  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
});

// test('correct treelike json data input returns corrent diff json', () => {
//   const { firstConfigPath, secondConfigPath, resultDiff } = testInit('json', 'treelikeConfigs');
//   expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(resultDiff);
// });

