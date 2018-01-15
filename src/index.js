
import fs from 'fs';
import path from 'path';
import buildAST from './ast';
import parse from './parser';
import astToString from './renders/';

const genDiffFromData = (firstConfigData, secondConfigData, outputFormat = 'string') => {
  const diffAST = buildAST(firstConfigData, secondConfigData);
  return astToString(diffAST, outputFormat);
};

const readFile = pathToFile => fs.readFileSync(path.resolve(process.env.PWD, pathToFile), 'utf-8');
const getExtension = pathToFile => path.extname(pathToFile).replace('.', '');

const genDiff = (firstConfigPath, secondConfigPath, outputFormat = 'string') => {
  const firstConfig = readFile(firstConfigPath);
  const secondConfig = readFile(secondConfigPath);
  const firstConfigData = parse(firstConfig, getExtension(firstConfigPath));
  const secondConfigData = parse(secondConfig, getExtension(secondConfigPath));
  return genDiffFromData(firstConfigData, secondConfigData, outputFormat);
};

export default genDiff;
