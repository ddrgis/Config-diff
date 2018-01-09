import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = pathToFile => fs.readFileSync(path.join(`${__dirname}/..`, pathToFile), 'utf-8');

const genDiff = (beforeConfigPath, afterConfigPath) => {
  const beforeConfig = JSON.parse(readFile(beforeConfigPath));
  const afterConfig = JSON.parse(readFile(afterConfigPath));
  const leftDiff = _.reduce(beforeConfig, (acc, beforeValue, key) => {
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
    leftDiff,
  );
  return JSON.stringify(fullDiff, undefined, '  ');
};

export default genDiff;
