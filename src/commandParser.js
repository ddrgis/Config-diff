import commander from 'commander';

export const getCommandParser = () => {
  const command = commander
    .version('0.0.1')
    .option('-f, --format [type]', 'Output format')
    .option('-V, --version', 'output the version number')
    .option('-h, --help', 'output usage information');
  return command;
};

export default getCommandParser;
