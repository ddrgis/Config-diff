#!/usr/bin/env node
import parseCommand from '../commandParser';
import start from '..';

start(parseCommand(process.argv));
