import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = pathToFile => fs.readFileSync(path.join(__dirname, pathToFile), 'utf-8');

const genDiff = (beforeConfigPath, afterConfigPath) => {
  // const beforeConfig = readFile(beforeConfigPath);
  // const afterConfig = readFile(afterConfigPath);
  const beforeConfig = JSON.parse(readFile('../__tests__/__fixtures__/before.json'));
  const afterConfig = JSON.parse(readFile('../__tests__/__fixtures__/after.json'));

  const leftDiff = _.reduce(beforeConfig, (acc, beforeValue, key) => {
    const afterValue = afterConfig[key];
    console.log(`${key}: before: ${beforeValue} after: ${afterValue}`);
    console.log(acc);
    if (afterValue === beforeValue) {
      return { ...acc, [`  ${key}`]: beforeValue };
    }
    if (afterValue === undefined) {
      return { ...acc, [`- ${key}`]: beforeValue };
    }
    return { ...acc, [`+ ${key}`]: afterValue, [`- ${key}`]: beforeValue };
  }, {});
  const fullDiff = _.reduce(afterConfig, (acc, afterValue, key) => {
    return beforeConfig[key] === undefined ? { ...acc, [`+ ${key}`]: afterValue } : acc;
  }, leftDiff);
  console.log(fullDiff);
  return JSON.stringify(fullDiff, undefined, '  ');
};

export default genDiff;
