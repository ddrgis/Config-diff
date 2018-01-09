/* eslint-disable */
import fs from 'fs';
import path from 'path';
//import parseCommand from '../src/commandParser';
import genDiff from '../src/gendiff';

const readFixtureFile = (fileName) => {
  return fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8');
};

test('genDiff correct json returns corrent diff.json', () => {
  const beforeConfig = readFixtureFile('before.json');
  const afterConfig = readFixtureFile('after.json');
  const resultDiff = readFixtureFile('diff.json');

  expect(genDiff(beforeConfig, afterConfig)).toEqual(resultDiff);
});
