#!/usr/bin/env node
import getParser from '../commandParser';
import start from '../index';

const cliCommandParser = getParser();
const command = cliCommandParser.parse(process.argv);
start(command);
