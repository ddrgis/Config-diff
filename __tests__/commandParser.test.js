/* eslint-disable */
import { getCommandParser } from '../src/commandParser';

const parser = getCommandParser();
const options = parser.options;

test('CommandParser is returned as object', () => {
  expect(typeof parser).toBe('object');
});

test('CommandParser defines -f option', () => {
  expect(options.find(opt => opt.short === '-f').short).toBe('-f');
});

test('CommandParser defines -V option', () => {
  expect(options.find(opt => opt.short === '-V').short).toBe('-V');
});

test('CommandParser defines program description', () => {
  expect(parser._description).toBe('Compares two configuration files and shows a difference.');
});