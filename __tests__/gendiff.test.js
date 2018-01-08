/* eslint-disable */
import parseCommand from '../src/commandParser';
import gendiff from '../src/';

test('general gendiff test', () => {
  const command = parseCommand(['sh', 'src', '-f', 'json',
    '/media/ddrgis/DATA/Sources/Hexlet/GenDiffProject/__tests__/__fixtures__/before.json',
    '/media/ddrgis/DATA/Sources/Hexlet/GenDiffProject/__tests__/__fixtures__/after.json']);

  expect(gendiff(command)).toBe(
    `{
      host: hexlet.io
    + timeout: 20
    - timeout: 50
    - proxy: 123.234.53.22
    + verbose: true
  }`
  );
});
