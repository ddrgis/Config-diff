/* eslint-disable */
import { getCommandParser } from '../src/commandParser';

test('CommandParser is returned as object', () => {
  expect(typeof getCommandParser()).toBe('object');
});

test('CommandParser defines -f option', () => {
  const parser = getCommandParser();
  const options = parser.options;

  expect(options.find(opt => opt.short === '-f').short).toBe('-f');
});

test('CommandParser defines -V option', () => {
  const parser = getCommandParser();
  const options = parser.options;

  expect(options.find(opt => opt.short === '-V').short).toBe('-V');
});

test('CommandParser defines program description', () => {
  const parser = getCommandParser();
  expect(parser._description).toBe('Compares two configuration files and shows a difference.');
});