import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

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

const getNodeType = (before, after) => {
  if (after === undefined) {
    return 'removed';
  }
  if (before === undefined) {
    return 'added';
  }
  if (after === before) {
    return 'notChanged';
  }
  return 'changed';
};

const nodeTypes = {
  removed: {
    getNewValue: before => before,
    nodeToString: (name, nodeValue) => `- ${name}: ${JSON.stringify(nodeValue.value)},\n`,
  },
  added: {
    getNewValue: (before, after) => after,
    nodeToString: (name, nodeValue) => `+ ${name}: ${JSON.stringify(nodeValue.value)},\n`,
  },
  notChanged: {
    getNewValue: (before, after) => after,
    nodeToString: (name, nodeValue) => `  ${name}: ${JSON.stringify(nodeValue.value)},\n`,
  },
  changed: {
    getNewValue: (before, after) => after,
    nodeToString: (name, nodeValue) => `+ ${name}: ${JSON.stringify(nodeValue.value)},\n  - ${name}: ${JSON.stringify(nodeValue.previousValue)},\n`,
  },
};

const buildNodeValue = (before, after) => {
  const nodeType = getNodeType(before, after);

  return {
    value: nodeTypes[nodeType].getNewValue(before, after),
    previousValue: before,
    type: nodeType,
    children: {},
  };
};

const diffAST = (firstConfig, secondConfig) => {
  const allKeys = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)]);
  return _.reduce(allKeys, (acc, key) => {
    const before = firstConfig[key];
    const after = secondConfig[key];
    return { ...acc, [key]: buildNodeValue(before, after) };
  }, {});
};

const diffASTToString = (ast) => {
  const nodes = `${_.reduce(ast, (acc, value, key) => acc.concat(`  ${nodeTypes[value.type].nodeToString(key, value)}`), '')}`;
  return `{\n${nodes}`.slice(0, -2).concat('\n}').replace(/"/g, '');
};

const makeDiff = (before, after) => {
  const diff = diffAST(before, after);
  return diffASTToString(diff);
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const parse = getParseMethod(firstConfigPath);
  const before = parse(readFile(firstConfigPath));
  const after = parse(readFile(secondConfigPath));

  return makeDiff(before, after);
};

export default genDiff;
