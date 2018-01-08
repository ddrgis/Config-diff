#!/usr/bin/env node
import parseCommand from '../commandParser';
import start from '..';

console.log(process.argv);
start(parseCommand(process.argv));
