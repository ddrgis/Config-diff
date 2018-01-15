import fs from 'fs';
import path from 'path';
import { getPathToFixtures } from './utils/utils';
import parseConfigFile from '../src/parser';

const readFile = pathToFile => fs.readFileSync(path.resolve(process.env.PWD, pathToFile), 'utf-8');

test('parse flat config.json', () => {
  const expectedObject = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };

  const data = readFile(getPathToFixtures('flatConfigs/after.json'));
  expect(parseConfigFile(data)).toEqual(expectedObject);
});
