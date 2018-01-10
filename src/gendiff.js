import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yamlParser from 'js-yaml';

const readFile = pathToFile => fs.readFileSync(path.join(`${__dirname}`, pathToFile), 'utf-8');

const parsers = {
  json: {
    parser: file => JSON.parse(file),
  },
  yml: {
    parser: file => yamlParser.safeLoad(file),
  },
  yaml: {
    parser: file => yamlParser.safeLoad(file),
  },
};

const genDiff = (beforeConfigPath, afterConfigPath) => {
  const extension = path.extname(beforeConfigPath).slice(1);
  const parse = parsers[extension].parser;

  const beforeConfig = parse(readFile(beforeConfigPath));
  const afterConfig = parse(readFile(afterConfigPath));
  console.log(beforeConfig);
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
