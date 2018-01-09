#!/usr/bin/env node
import parseCommand from '../commandParser';
import genDiff from '../gendiff';

const command = parseCommand(process.argv);

console.log(`ARGV: ${process.argv}`);
console.log(`COMMAND: ${JSON.stringify(command, undefined, ' ')}`);
console.log();

const firstConfigPath = command.args[0];
const secondConfigPath = command.args[1];

genDiff(firstConfigPath, secondConfigPath);
