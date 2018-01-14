
import buildAST from './ast';
import parse from './parser';
import astToString from './render';

// Оставил эту функцию для возможной адаптации к данным не из файлов
const genDiffFromData = (firstConfigData, secondConfigData) => {
  const diffAST = buildAST(firstConfigData, secondConfigData);
  return astToString(diffAST, 'json');
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const firstConfigData = parse(firstConfigPath);
  const secondConfigData = parse(secondConfigPath);
  return genDiffFromData(firstConfigData, secondConfigData);
};

export default genDiff;
