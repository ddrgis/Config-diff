import fs from 'fs';
import { URL } from 'url';
import _ from 'lodash';

export const parse = (json) => {
  const data = JSON.parse(json);
  return Object.keys(data).reduce((acc, key) =>
    ({ ...acc, [key]: { value: data[key], isChanged: false, previousValue: null } }), {});
};

const isChanged = (before, after) => before !== after;

export const makeDiff = (beforeAST, afterAST) => {
  const afterDiff = Object.keys(afterAST).reduce((acc, key) => {
    const before = _.isNil(beforeAST[key]) ? null : beforeAST[key].value;
    const after = _.isNil(afterAST[key]) ? null : afterAST[key].value;
    return {
      ...acc,
      [key]: {
        value: after,
        isChanged: isChanged(before, after),
        previousValue: before,
      },
    };
  }, {});
  const missedKeys = Object.keys(beforeAST).filter(key => afterAST[key] === undefined);
  return missedKeys.reduce((acc, key) => ({
    ...acc,
    [key]: {
      value: null,
      isChanged: true,
      previousValue: beforeAST[key].value,
    },
  }), afterDiff);
};

export const gendiff = (command, readFile = fs.readFileSync) => {
  const firstConfigPath = command.args[0];
  const secondConfigPath = command.args[1];
  const firstConfig = readFile(new URL(`file://${firstConfigPath}`), 'utf-8');
  const secondConfig = readFile(new URL(`file://${secondConfigPath}`), 'utf-8');

  // const firstParsed = parse(firstConfig);
  // const secondParsed = parse(secondConfig);

  return firstConfig + secondConfig;
};

export default gendiff;
