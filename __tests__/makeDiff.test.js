import fs from 'fs';
import path from 'path';
import { makeDiff } from '../src/gendiff';

const readFixtureFile = fileName => fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8');

test('correct json input returns corrent diff json', () => {
  const firstConfig = JSON.parse(readFixtureFile('flatConfigs/before.json'));
  const secondConfig = JSON.parse(readFixtureFile('flatConfigs/after.json'));
  const resultDiff = readFixtureFile('flatConfigs/diff.txt');

  expect(makeDiff(firstConfig, secondConfig)).toEqual(resultDiff);
});

