import commander from 'commander';

export const getCommandParser = () => {
  const parser = commander
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1')
    .option('-f, --format [type]', 'Output format')
    .option('-V, --version', 'output the version number')
    .arguments('<firstConfig> <secondConfig>');
  return parser;
};

export default getCommandParser;
