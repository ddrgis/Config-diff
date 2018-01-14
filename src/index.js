
import buildAST, { render as astToString } from './ast';
import parse from './parser';

// Оставил эту функцию для возможной адаптации к данным не из файлов
const genDiffFromData = (firstConfigData, secondConfigData) => {
  const diffAST = buildAST(firstConfigData, secondConfigData);
  console.log(diffAST);
  return astToString(diffAST);
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const firstConfigData = parse(firstConfigPath);
  const secondConfigData = parse(secondConfigPath);
  return genDiffFromData(firstConfigData, secondConfigData);
};

export default genDiff;
