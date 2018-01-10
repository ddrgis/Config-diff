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

const getParseMethod = extension => parsers[extension].parse;

const getExtension = pathToFile => path.extname(pathToFile).slice(1);

const genDiff = (beforeConfigPath, afterConfigPath) => {
  const extension = getExtension(beforeConfigPath);
  const parse = getParseMethod(extension);
  const parsedBeforeConfig = parse(beforeConfigPath);
  const parsedAfterConfig = parse(afterConfigPath);

  const diffExpectNewLines = _.reduce(parsedBeforeConfig, (acc, beforeValue, key) => {
    const afterValue = parsedAfterConfig[key];
    if (afterValue === beforeValue) {
      return { ...acc, [`  ${key}`]: beforeValue };
    }
    if (afterValue === undefined) {
      return { ...acc, [`- ${key}`]: beforeValue };
    }
    return { ...acc, [`+ ${key}`]: afterValue, [`- ${key}`]: beforeValue };
  }, {});
  const fullDiff = _.reduce(
    parsedAfterConfig,
    (acc, afterValue, key) => (parsedBeforeConfig[key] === undefined ? { ...acc, [`+ ${key}`]: afterValue } : acc),
    diffExpectNewLines,
  );
  return JSON.stringify(fullDiff, undefined, '  ');
};

export default genDiff;
