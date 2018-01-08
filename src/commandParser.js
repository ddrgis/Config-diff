import commander from 'commander';
import info from '../package.json';

export default args => commander
  .description('Compares two configuration files and shows a difference.')
  .version(info.version)
  .option('-f, --format [type]', 'Output format')
  .option('-V, --version', 'output the version number')
  .arguments('<firstConfig> <secondConfig>')
  .parse(args);
