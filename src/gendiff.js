import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yamlParser from 'js-yaml';

const readFile = pathToFile => fs.readFileSync(path.join(`${process.env.PWD}`, pathToFile), 'utf-8');

const parsers = {
  json: {
    parse: file => JSON.parse(file),
  },
  yml: {
    parse: file => yamlParser.safeLoad(file),
  },
  yaml: {
    parse: file => yamlParser.safeLoad(file),
  },
};

const genDiff = (beforeConfigPath, afterConfigPath) => {
  const extension = path.extname(beforeConfigPath).slice(1);
  const { parse } = parsers[extension];
  const beforeConfig = parse(readFile(beforeConfigPath));
  const afterConfig = parse(readFile(afterConfigPath));
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
