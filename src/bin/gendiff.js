#!/usr/bin/env node
import parseCommand from '../commandParser';
import genDiff from '../gendiff';

console.log(process.argv);
genDiff(parseCommand(process.argv));
