import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

const readFile = pathToFile => fs.readFileSync(path.join(`${process.env.PWD}`, pathToFile), 'utf-8');

const parsers = {
  json: {
    parse: data => JSON.parse(data),
  },
  yml: {
    parse: data => yamlParser.safeLoad(data),
  },
  yaml: {
    parse: data => yamlParser.safeLoad(data),
  },
  ini: {
    parse: data => iniParser.parse(data),
  },
};

const getExtension = pathToFile => path.extname(pathToFile).slice(1);

const getParseMethod = (configPath) => {
  const configExtention = getExtension(configPath);
  return parsers[configExtention].parse;
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const parse = getParseMethod(firstConfigPath);
  const before = parse(readFile(firstConfigPath));
  const after = parse(readFile(secondConfigPath));

  const diffExpectNewLines = _.reduce(before, (acc, beforeValue, key) => {
    const afterValue = after[key];
    if (afterValue === beforeValue) {
      return { ...acc, [`  ${key}`]: beforeValue };
    }
    if (afterValue === undefined) {
      return { ...acc, [`- ${key}`]: beforeValue };
    }
    return { ...acc, [`+ ${key}`]: afterValue, [`- ${key}`]: beforeValue };
  }, {});

  const fullDiff = _.reduce(
    after,
    (acc, afterValue, key) => (before[key] === undefined ? { ...acc, [`+ ${key}`]: afterValue } : acc),
    diffExpectNewLines,
  );
  return JSON.stringify(fullDiff, undefined, '  ').replace(/"/g, '');
};

export default genDiff;
