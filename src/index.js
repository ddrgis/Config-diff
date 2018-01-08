import fs from 'fs';
import { URL } from 'url';

export default (command) => {
  const firstConfigPath = command.args[0];
  // const secondConfigPath = command.args[1];
  const firstConfig = fs.readFileSync(new URL(`file://${firstConfigPath}`), 'utf-8');
  // const secondConfig = fs.readFileSync(new URL(`file://${secondConfigPath}`), 'utf-8');

  return firstConfig;
};
