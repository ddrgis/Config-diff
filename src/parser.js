import yamlParser from 'js-yaml';
import iniParser from 'ini';
import path from 'path';
import fs from 'fs';

const parsers = {
  json: JSON.parse,
  yml: yamlParser.safeLoad,
  yaml: yamlParser.safeLoad,
  ini: iniParser.parse,
};

const getParseMethod = (configPath) => {
  const getExtension = pathToFile => path.extname(pathToFile).replace('.', '');

  const configExtention = getExtension(configPath);
  return parsers[configExtention];
};

const parseConfigFile = (pathToConfig) => {
  const readFile = pathToFile => fs.readFileSync(path.resolve(process.env.PWD, pathToFile), 'utf-8');

  const parse = getParseMethod(pathToConfig);
  return parse(readFile(pathToConfig));
};

export default parseConfigFile;

