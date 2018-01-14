
import buildAST from './ast';
import parse from './parser';
import astToString from './render';

// Оставил эту функцию для возможной адаптации к данным не из файлов
const genDiffFromData = (firstConfigData, secondConfigData, outputFormat = 'string') => {
  const diffAST = buildAST(firstConfigData, secondConfigData);
  return astToString(diffAST, outputFormat);
};

const genDiff = (firstConfigPath, secondConfigPath, outputFormat = 'string') => {
  const firstConfigData = parse(firstConfigPath);
  const secondConfigData = parse(secondConfigPath);
  return genDiffFromData(firstConfigData, secondConfigData, outputFormat);
};

export default genDiff;
