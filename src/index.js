import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';
import { isNull } from 'util';

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
  if (_.isEqual(previousValue, newValue)) {
    return 'notChanged';
  }
  return 'changed';
};

const nodeToString = (name, value) => {
  if (typeof value === 'object') {
    return `{\n${_.reduce(value, (acc, val, key) => acc.concat(`${name}: ${nodeToString(key, val)}`), '')}\n}`;
  }
  return value;
};

const nodeTypes = {
  removed: {
    getNewValue: previousValue => (typeof previousValue === 'object' ? null : previousValue),
    getChildren: previousValue => (typeof previousValue === 'object' ? previousValue : {}),
    toString: (name, nodeValue) => `- ${nodeToString(name, nodeValue)},\n`,
  },
  added: {
    getNewValue: (previousValue, newValue) => (typeof newValue === 'object' ? null : newValue),
    getChildren: (previousValue, newValue) => (typeof newValue === 'object' ? newValue : {}),
    toString: (name, nodeValue) => `+ ${nodeToString(name, nodeValue)},\n`,
  },
  notChanged: {
    getNewValue: previousValue => (typeof previousValue === 'object' ? null : previousValue),
    getChildren: previousValue => (typeof previousValue === 'object' ? previousValue : {}),
    toString: (name, nodeValue) => `  ${nodeToString(name, nodeValue)},\n`,
  },
  changed: {
    getNewValue: (previousValue, newValue) => (typeof newValue === 'object' ? null : newValue),
    getChildren: (previousValue, newValue) => (typeof newValue === 'object' ? newValue : {}),
    toString: (name, nodeValue) => `+ ${name}: ${nodeToString(name, nodeValue)},\n  - ${nodeToString(name, nodeValue.previousValue)},\n`,
  },
};

const buildAST = (firstConfig, secondConfig) => {
  const getNodeValue = (previousValue, newValue) => {
    const type = getNodeType(previousValue, newValue);
    // console.log('newValue: ', newValue);
    // console.log('previousValue: ', previousValue);
    // console.log('nodeType: ', type);
    const value = nodeTypes[type].getNewValue(previousValue, newValue);
    const children = nodeTypes[type].getChildren(previousValue, newValue);
    const previousChildren = typeof previousValue === 'object' ? previousValue : {};
    if (isNull(value)) {
      return {
        value,
        type,
        children: _.reduce(children, (acc, child, key) => ({
          ...acc,
          value,
          type,
          [key]: getNodeValue(previousChildren[key], child),
        }), {}),
      };
    }
    return {
      value,
      previousValue,
      type,
      children,
    };
  };

  const allKeys = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)]);
  return _.reduce(allKeys, (acc, nodeName) => {
    const previousValue = firstConfig[nodeName];
    const newValue = secondConfig[nodeName];
    // console.log('NODENAME', nodeName);
    return { ...acc, [nodeName]: getNodeValue(previousValue, newValue) };
  }, {});
};


const diffASTToString = (ast) => {
  const reduceToString = (acc, value, key) => {
    // console.log('key: ', key);
    // console.log('value: ', value);
    return acc.concat(`  ${nodeTypes[value.type].toString(key, value)}`);
  };

  const nodes = `${_.reduce(ast, reduceToString, '')}`;
  return `{\n${nodes}`.slice(0, -2).concat('\n}').replace(/"/g, '');
};

const makeDiff = (firstConfig, secondConfig) => {
  const diffAST = buildAST(firstConfig, secondConfig);
  console.log(JSON.stringify(diffAST, undefined, '  '));
  // return diffASTToString(diffAST);
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const parse = getParseMethod(firstConfigPath);
  const firstConfig = parse(readFile(firstConfigPath));
  const secondConfig = parse(readFile(secondConfigPath));

  return makeDiff(firstConfig, secondConfig);
};

export default genDiff;
