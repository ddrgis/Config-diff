
import buildAST, { render as diffASTToString } from './ast';
import parse from './parser';

const makeDiff = (firstConfig, secondConfig) => {
  const diffAST = buildAST(firstConfig, secondConfig);
  return diffASTToString(diffAST);
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const firstConfig = parse(firstConfigPath);
  console.log('firstConfig: ', firstConfig);
  const secondConfig = parse(secondConfigPath);
  return makeDiff(firstConfig, secondConfig);
};

export default genDiff;
