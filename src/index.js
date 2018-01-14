import fs from 'fs';
import path from 'path';
import yamlParser from 'js-yaml';
import iniParser from 'ini';
import buildAST, { render as diffASTToString } from './ast';

const readFile = pathToFile => fs.readFileSync(path.resolve(process.env.PWD, pathToFile), 'utf-8');

const parsers = {
  json: JSON.parse,
  yml: yamlParser.safeLoad,
  yaml: yamlParser.safeLoad,
  ini: iniParser.parse,
};

const getExtension = pathToFile => path.extname(pathToFile).slice(1);

const getParseMethod = (configPath) => {
  const configExtention = getExtension(configPath);
  return parsers[configExtention];
};

const makeDiff = (firstConfig, secondConfig) => {
  const diffAST = buildAST(firstConfig, secondConfig);
  console.log(JSON.stringify(diffAST, undefined, '  '));
  return diffASTToString(diffAST);
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const parse = getParseMethod(firstConfigPath);
  const firstConfig = parse(readFile(firstConfigPath));
  console.log('firstConfig ', firstConfig);
  const secondConfig = parse(readFile(secondConfigPath));
  console.log('secondConfig: ', secondConfig);

  return makeDiff(firstConfig, secondConfig);
};

export default genDiff;
