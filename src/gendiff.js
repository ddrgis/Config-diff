import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yamlParser from 'js-yaml';

const readFile = pathToFile => fs.readFileSync(path.join(`${process.env.PWD}`, pathToFile), 'utf-8');

const parsers = {
  json: {
    parse: pathToFile => JSON.parse(readFile(pathToFile)),
  },
  yml: {
    parse: pathToFile => yamlParser.safeLoad(readFile(pathToFile)),
  },
  yaml: {
    parse: pathToFile => yamlParser.safeLoad(readFile(pathToFile)),
  },
};

const getExtension = pathToFile => path.extname(pathToFile).slice(1);

const getParseMethod = (pathToConfig) => {
  const configExtention = getExtension(pathToConfig);
  return parsers[configExtention].parse;
};

const genDiff = (beforeConfigPath, afterConfigPath) => {
  const parse = getParseMethod(beforeConfigPath);
  const beforeConfig = parse(beforeConfigPath);
  const afterConfig = parse(afterConfigPath);

  const diffExpectNewLines = _.reduce(beforeConfig, (acc, beforeValue, key) => {
    const afterValue = afterConfig[key];
    if (afterValue === beforeValue) {
      return { ...acc, [`  ${key}`]: beforeValue };
    }
    if (afterValue === undefined) {
      return { ...acc, [`- ${key}`]: beforeValue };
    }
    return { ...acc, [`+ ${key}`]: afterValue, [`- ${key}`]: beforeValue };
  }, {});

  const fullDiff = _.reduce(
    afterConfig,
    (acc, afterValue, key) => (beforeConfig[key] === undefined ? { ...acc, [`+ ${key}`]: afterValue } : acc),
    diffExpectNewLines,
  );
  return JSON.stringify(fullDiff, undefined, '  ');
};

export default genDiff;
