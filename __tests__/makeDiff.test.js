import fs from 'fs';
import path from 'path';
import { makeDiff } from '../src/gendiff';

const readFixtureFile = fileName => fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf-8');

test('correct json input returns corrent diff json', () => {
  const firstConfig = JSON.parse(readFixtureFile('before.json'));
  const secondConfig = JSON.parse(readFixtureFile('after.json'));
  const resultDiff = readFixtureFile('diff.json').replace(/"/g, '');

  expect(makeDiff(firstConfig, secondConfig)).toEqual(resultDiff);
});

