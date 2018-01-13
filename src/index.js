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

const getNodeType = (previousValue, newValue) => {
  if (newValue === undefined) {
    return 'removed';
  }
  if (previousValue === undefined) {
    return 'added';
  }
  if (newValue === previousValue) {
    return 'notChanged';
  }
  return 'changed';
};

const nodeTypes = {
  removed: {
    getNewValue: previousValue => previousValue,
    nodeToString: (name, nodeValue) => `- ${name}: ${JSON.stringify(nodeValue.value)},\n`,
  },
  added: {
    getNewValue: (previousValue, newValue) => newValue,
    nodeToString: (name, nodeValue) => `+ ${name}: ${JSON.stringify(nodeValue.value)},\n`,
  },
  notChanged: {
    getNewValue: (previousValue, newValue) => newValue,
    nodeToString: (name, nodeValue) => `  ${name}: ${JSON.stringify(nodeValue.value)},\n`,
  },
  changed: {
    getNewValue: (previousValue, newValue) => newValue,
    nodeToString: (name, nodeValue) => `+ ${name}: ${JSON.stringify(nodeValue.value)},\n  - ${name}: ${JSON.stringify(nodeValue.previousValue)},\n`,
  },
};

const getNodeValue = (previousValue, newValue) => {
  const type = getNodeType(previousValue, newValue);
  return {
    value: nodeTypes[type].getNewValue(previousValue, newValue),
    previousValue,
    type,
    children: {},
  };
};

const buildAST = (firstConfig, secondConfig) => {
  const allKeys = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)]);
  return _.reduce(allKeys, (acc, nodeName) => {
    const previousValue = firstConfig[nodeName];
    const newValue = secondConfig[nodeName];
    return { ...acc, [nodeName]: getNodeValue(previousValue, newValue) };
  }, {});
};

const diffASTToString = (ast) => {
  const nodes = `${_.reduce(ast, (acc, value, key) => acc.concat(`  ${nodeTypes[value.type].nodeToString(key, value)}`), '')}`;
  return `{\n${nodes}`.slice(0, -2).concat('\n}').replace(/"/g, '');
};

const makeDiff = (firstConfig, secondConfig) => {
  const diffAST = buildAST(firstConfig, secondConfig);
  return diffASTToString(diffAST);
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const parse = getParseMethod(firstConfigPath);
  const firstConfig = parse(readFile(firstConfigPath));
  const secondConfig = parse(readFile(secondConfigPath));

  return makeDiff(firstConfig, secondConfig);
};

export default genDiff;
