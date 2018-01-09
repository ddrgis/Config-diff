/* eslint-disable */
import parseCommand from '../src/commandParser';
import { gendiff, genDiff, parse, makeDiff, diffToString } from '../src/gendiff';

const firstConfigAST = {
  host: { value: "hexlet.io", isChanged: false, previousValue: null },
  timeout: { value: 50, isChanged: false, previousValue: null },
  proxy: { value: "123.234.53.22", isChanged: false, previousValue: null}
};

const secondConfigAST = {
  timeout: { value: 20, isChanged: false, previousValue: null },
  verbose: { value: true, isChanged: false, previousValue: null },
  host: { value: "hexlet.io", isChanged: false, previousValue: null}
};

test('json parse firstConfig', () => {
  expect(parse(firstConfig)).toEqual(firstConfigAST);
});

test('json parse secondConfig', () => {
  expect(parse(secondConfig)).toEqual(secondConfigAST);
});

const diffAST = {
  host: {value: 'hexlet.io', isChanged: false, previousValue: 'hexlet.io'},
  timeout: {value: 20, isChanged: true, previousValue: 50},
  proxy: {value: null, isChanged: true, previousValue: '123.234.53.22'},
  verbose: {value: true, isChanged: true, previousValue: null},
};

test('makeDiff from two AST', () => {
  expect(makeDiff(firstConfigAST, secondConfigAST))
  .toEqual(diffAST);
});

const genDiffResult = '{\n' +
                      '\t  host: hexlet.io\n' +
                      '\t+ timeout: 20\n' +
                      '\t- timeout: 50\n' +
                      '\t- proxy: 123.234.53.22\n' +
                      '\t+ verbose: true\n' +
                      '}';

test('diffAST to string', () => {
  expect(diffToString(diffAST)).toBe(genDiffResult)}
);

const firstConfig = JSON.stringify({
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22"
});

const secondConfig = JSON.stringify({
  "timeout": 20,
  "verbose": true,
  "host": "hexlet.io"
});

const command = parseCommand(['fakeShell', 'fakeSrc']);

test('general genDiff test', () => {
  expect(genDiff(command, firstConfig, secondConfig)).toBe(genDiffResult);
});