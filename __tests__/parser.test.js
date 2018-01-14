import { getPathToFixtures } from './utils/utils';
import parseConfigFile from '../src/parser';

test('parse flat config.json', () => {
  const expectedObject = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };

  expect(parseConfigFile(getPathToFixtures('flatConfigs/after.json'))).toEqual(expectedObject);
});
