/* eslint-disable */
import parseCommand from '../src/commandParser';

const stubProcessArgs = ['sh', 'src'];

test('CommandParser is returned as object', () => {
  expect(typeof parseCommand(stubProcessArgs)).toBe('object');
});

test('CommandParser defines -f option', () => {
  expect(parseCommand(stubProcessArgs.concat('-f')).options.find(opt => opt.short === '-f').short).toBe('-f');
});

test('CommandParser defines program description', () => {
  expect(parseCommand(stubProcessArgs)._description).toBe('Compares two configuration files and shows a difference.');
});