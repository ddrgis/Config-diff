#!/usr/bin/env node
import parseCommand from '../commandParser';
import genDiff from '../gendiff';

const command = parseCommand(process.argv);

const firstConfigPath = command.args[0];
const secondConfigPath = command.args[1];

console.log(genDiff(firstConfigPath, secondConfigPath));
