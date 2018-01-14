import { readFixtureFile } from './utils/utils';
import render from '../src/render';
import { bigTreelikeAST } from './utils/testData';

const flatAST = [
  {
    name: 'host', type: 'notChanged', newValue: 'hexlet.io',
  },
  {
    name: 'timeout', type: 'changed', newValue: 20, previousValue: 50,
  },
  {
    name: 'proxy', type: 'deleted', previousValue: '123.234.53.22',
  },
  {
    name: 'verbose', type: 'added', newValue: true,
  },
];

test('flat ast rendering to JSON', () => {
  const expectedResult = readFixtureFile('flatConfigs/diff.txt');

  expect(render(flatAST)).toBe(expectedResult);
});

test('flat ast rendering to Plain', () => {
  const expectedResult = readFixtureFile('flatConfigs/plainDiff.txt');
  expect(render(flatAST, 'plain')).toBe(expectedResult);
});

test('treelike ast rendering to Plain', () => {
  const expectedResult = readFixtureFile('treelikeConfigs/plainDiff.txt');
  expect(render(bigTreelikeAST, 'plain')).toBe(expectedResult);
});
