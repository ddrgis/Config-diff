import fs from 'fs';
import path from 'path';
import { makeDiff } from '../src/gendiff';

const readFixtureFile = fileName => fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8');

test('correct json data input returns corrent diff json', () => {
  const firstConfig = JSON.parse(readFixtureFile('flatConfigs/before.json'));
  const secondConfig = JSON.parse(readFixtureFile('flatConfigs/after.json'));
  const resultDiff = readFixtureFile('flatConfigs/diff.txt');

  expect(makeDiff(firstConfig, secondConfig)).toEqual(resultDiff);
});

test('correct json data input returns corrent diff json', () => {
  const firstConfig = JSON.parse(readFixtureFile('treelikeConfigs/before.json'));
  const secondConfig = JSON.parse(readFixtureFile('treelikeConfigs/after.json'));
  const resultDiff = readFixtureFile('treelikeConfigs/diff.txt');

  expect(makeDiff(firstConfig, secondConfig)).toEqual(resultDiff);
});

