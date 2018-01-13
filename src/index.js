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

const nodeToString = (name, value) => `${name}: ${JSON.stringify(value)}`;

const nodeTypes = {
  removed: {
    getNewValue: previousValue => previousValue,
    toFormattedString: node => `- ${nodeToString(node.name, node.previousValue)},\n`,
  },
  added: {
    getNewValue: (previousValue, newValue) => newValue,
    toFormattedString: node => `+ ${nodeToString(node.name, node.newValue)},\n`,
  },
  notChanged: {
    getNewValue: (previousValue, newValue) => newValue,
    toFormattedString: node => `  ${nodeToString(node.name, node.newValue)},\n`,
  },
  changed: {
    getNewValue: (previousValue, newValue) => newValue,
    toFormattedString: node => `+ ${nodeToString(node.name, node.newValue)},\n  - ${nodeToString(node.name, node.previousValue)},\n`,
  },
};

const buildNode = (nodeName, previousValue, newValue) => {
  const type = getNodeType(previousValue, newValue);
  return {
    name: nodeName,
    newValue: nodeTypes[type].getNewValue(previousValue, newValue),
    previousValue,
    type,
    children: [],
  };
};

const buildAST = (firstConfig, secondConfig) => {
  const allUniqNames = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)])
    .filter((value, index, self) => self.indexOf(value) === index);

  return _.reduce(allUniqNames, (acc, nodeName) => {
    const previousValue = firstConfig[nodeName];
    const newValue = secondConfig[nodeName];
    return [...acc, buildNode(nodeName, previousValue, newValue)];
  }, []);
};

const diffASTToString = (ast) => {
  const nodes = `${ast.reduce((acc, node) => acc.concat(`  ${nodeTypes[node.type].toFormattedString(node)}`), '')}`;
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
