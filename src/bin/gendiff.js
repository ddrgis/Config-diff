#!/usr/bin/env node
import parseCommand from '../commandParser';
import { gendiff } from '../gendiff';

console.log(process.argv);
gendiff(parseCommand(process.argv));
