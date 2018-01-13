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
    nodeToString: node => `- ${node.name}: ${JSON.stringify(node.value)},\n`,
  },
  added: {
    getNewValue: (previousValue, newValue) => newValue,
    nodeToString: node => `+ ${node.name}: ${JSON.stringify(node.value)},\n`,
  },
  notChanged: {
    getNewValue: (previousValue, newValue) => newValue,
    nodeToString: node => `  ${node.name}: ${JSON.stringify(node.value)},\n`,
  },
  changed: {
    getNewValue: (previousValue, newValue) => newValue,
    nodeToString: node => `+ ${node.name}: ${JSON.stringify(node.value)},\n  - ${node.name}: ${JSON.stringify(node.previousValue)},\n`,
  },
};

const getNode = (nodeName, previousValue, newValue) => {
  const type = getNodeType(previousValue, newValue);
  return {
    name: nodeName,
    value: nodeTypes[type].getNewValue(previousValue, newValue),
    type,
    children: [],
    previousValue,
  };
};

const buildAST = (firstConfig, secondConfig) => {
  const allUniqNames = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)])
    .filter((value, index, self) => self.indexOf(value) === index);

  return _.reduce(allUniqNames, (acc, nodeName) => {
    const previousValue = firstConfig[nodeName];
    const newValue = secondConfig[nodeName];
    return [...acc, getNode(nodeName, previousValue, newValue)];
  }, []);
};

const diffASTToString = (ast) => {
  const nodes = `${ast.reduce((acc, node) => acc.concat(`  ${nodeTypes[node.type].nodeToString(node)}`), '')}`;
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
