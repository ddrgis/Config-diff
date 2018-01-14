#!/usr/bin/env node
import commander from 'commander';
import info from '../../package.json';
import genDiff from '..';

commander
  .description('Compares two configuration files and shows a difference.')
  .version(info.version)
  .option('-V, --version', 'output the version number');

commander
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format', 'json')
  .action((firstConfigPath, secondConfigPath, cmd) => {
    console.log(genDiff(firstConfigPath, secondConfigPath, this.format));
  });

commander.parse(process.argv);

const isNoCommandSpecified = commander.args.length === 0;
if (isNoCommandSpecified) {
  commander.help();
}
