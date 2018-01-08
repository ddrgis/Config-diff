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

test('CommandParser defines -h option', () => {
  const parser = getCommandParser();
  const options = parser.options;

  expect(options.find(opt => opt.short === '-h').short).toBe('-h');
});

test('CommandParser defines -V option', () => {
  const parser = getCommandParser();
  const options = parser.options;

  expect(options.find(opt => opt.short === '-V').short).toBe('-V');
});