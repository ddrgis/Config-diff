#!/usr/bin/env node
import parseCommand from '../commandParser';
import genDiff from '../gendiff';

const command = parseCommand(process.argv);
const [firstConfigPath, secondConfigPath] = command.args;
console.log(genDiff(firstConfigPath, secondConfigPath));
