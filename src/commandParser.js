import commander from 'commander';

export const getCommandParser = () => {
  const command = commander
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1')
    .option('-f, --format [type]', 'Output format')
    .option('-V, --version', 'output the version number')
    .option('-h, --help', 'output usage information');
  return command;
};

export default getCommandParser;
