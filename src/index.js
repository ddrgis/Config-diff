import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

const readFile = pathToFile => fs.readFileSync(path.resolve(process.env.PWD, pathToFile), 'utf-8');

const parsers = {
  json: data => JSON.parse(data),
  yml: data => yamlParser.safeLoad(data),
  yaml: data => yamlParser.safeLoad(data),
  ini: data => iniParser.parse(data),
};

const getExtension = pathToFile => path.extname(pathToFile).slice(1);

const getParseMethod = (configPath) => {
  const configExtention = getExtension(configPath);
  return parsers[configExtention];
};

const createAST = object => _.reduce(
  object,
  (acc, value, key) => ({ ...acc, [key]: { value, status: null, children: {} } }), {},
);

const diffAST = (beforeChangingAST, afterChangingAST) => {
  const withoutAddedLines = _.reduce(beforeChangingAST, (acc, before, key) => {
    const after = afterChangingAST[key];
    if (after === undefined) {
      return { ...acc, [`- ${key}`]: { ...before, status: 'removed' } };
    }
    if (after.value === before.value) {
      return { ...acc, [`  ${key}`]: { ...before, status: 'notChanged' } };
    }
    return { ...acc, [`+ ${key}`]: { ...after, status: 'Changed' }, [`- ${key}`]: { ...before, status: 'changed' } };
  }, {});
  const addedKeys = Object.keys(afterChangingAST)
    .filter(key => beforeChangingAST[key] === undefined);

  return _.reduce(addedKeys, (acc, key) => ({ ...acc, [`+ ${key}`]: { ...afterChangingAST[key], status: 'added' } }), withoutAddedLines);
};

const diffASTToString = ast => JSON.stringify(
  _.reduce(ast, (acc, value, key) => ({ ...acc, [key]: value.value }), {}),
  undefined, '  ',
).replace(/"/g, '');

const makeDiff = (before, after) => {
  const beforeChangingAST = createAST(before);
  const afterChangingAST = createAST(after);
  const diff = diffAST(beforeChangingAST, afterChangingAST);
  return diffASTToString(diff);
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const parse = getParseMethod(firstConfigPath);
  const before = parse(readFile(firstConfigPath));
  const after = parse(readFile(secondConfigPath));

  return makeDiff(before, after);
};

export default genDiff;
