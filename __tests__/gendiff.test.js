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

const testInit = (inputFormat) => {
  return {
    beforeConfig: getPathToFixtures(`before.${inputFormat}`),
    afterConfig: getPathToFixtures(`after.${inputFormat}`),
    resultDiff: readFixtureFile('diff.json'),
  }
}

test('correct json input returns corrent diff json', () => {
  const {beforeConfig, afterConfig, resultDiff} = testInit('json');

  expect(genDiff(beforeConfig, afterConfig)).toEqual(resultDiff);
});

test('correct yaml input returns corrent diff json', () => {
  const {beforeConfig, afterConfig, resultDiff} = testInit('yaml');

  expect(genDiff(beforeConfig, afterConfig)).toEqual(resultDiff);
});