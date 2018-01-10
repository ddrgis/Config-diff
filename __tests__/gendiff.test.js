/* eslint-disable */
import fs from 'fs';
import path from 'path';
//import parseCommand from '../src/commandParser';
import genDiff from '../src/gendiff';

const readFixtureFile = (fileName) => {
  return fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8');
};

const getPathToFixtures = (fileName) => {
  return `./__tests__/__fixtures__/${fileName}`;
};

test('correct json input returns corrent diff json', () => {
  const beforeConfig = getPathToFixtures('before.json');
  const afterConfig = getPathToFixtures('after.json');
  const resultDiff = readFixtureFile('diff.json');

  expect(genDiff(beforeConfig, afterConfig)).toEqual(resultDiff);
});

test('correct yaml input returns corrent diff json', () => {
  const beforeConfig = getPathToFixtures('before.yaml');
  const afterConfig = getPathToFixtures('after.yaml');
  const resultDiff = readFixtureFile('diff.json');

  expect(genDiff(beforeConfig, afterConfig)).toEqual(resultDiff);
});