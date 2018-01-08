/* eslint-disable */
import parseCommand from '../src/commandParser';
import { gendiff, parse, makeDiff } from '../src/gendiff';

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

// test('general gendiff test', () => {
//   const readFile = (url) => {
//     let counter = 0;
//     return (() => {
//       counter += 1;
//       return counter === 1 ? firstConfig : secondConfig;
//     })();
//   };
  
//   expect(gendiff(command, readFile)).toBe(
//     `{
//       host: hexlet.io
//     + timeout: 20
//     - timeout: 50
//     - proxy: 123.234.53.22
//     + verbose: true
//   }`
//   );
// });

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


test('makeDiff from two AST', () => {
  expect(makeDiff(firstConfigAST, secondConfigAST))
  .toEqual({
    host: {value: 'hexlet.io', isChanged: false, previousValue: 'hexlet.io'},
    timeout: {value: 20, isChanged: true, previousValue: 50},
    proxy: {value: null, isChanged: true, previousValue: '123.234.53.22'},
    verbose: {value: true, isChanged: true, previousValue: null},
  });
});
