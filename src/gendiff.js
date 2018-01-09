import fs from 'fs';
import { URL } from 'url';
import _ from 'lodash';

export const parse = (json) => {
  const data = JSON.parse(json);
  return Object.keys(data).reduce((acc, key) =>
    ({ ...acc, [key]: { value: data[key], isChanged: false, previousValue: null } }), {});
};

const isChanged = (before, after) => before !== after;
const isEdited = ({ previousValue: before, value: after }) =>
  isChanged(before, after) && before !== null && after !== null;
const isRemoved = ({ previousValue: before, value: after }) =>
  isChanged(before, after) && after === null;

export const makeDiff = (beforeAST, afterAST) => {
  const beforeDiff = Object.keys(beforeAST).reduce((acc, key) => {
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
  const missedKeys = Object.keys(afterAST).filter(key => beforeAST[key] === undefined);
  return missedKeys.reduce((acc, key) => ({
    ...acc,
    [key]: {
      value: afterAST[key].value,
      isChanged: true,
      previousValue: null,
    },
  }), beforeDiff);
};

/* eslint-disable arrow-body-style */
export const diffToString = (diffAST) => {
  return Object.keys(diffAST).reduce((acc, key) => {
    const item = diffAST[key];
    const { previousValue: before, value: after } = item;
    if (isEdited(item)) {
      return acc.concat(`\t+ ${key}: ${after}\n`)
        .concat(`\t- ${key}: ${before}\n`);
    }
    if (isRemoved(item)) {
      return acc.concat(`\t- ${key}: ${before}\n`);
    }
    if (!item.isChanged) {
      return acc.concat(`\t  ${key}: ${after}\n`);
    }
    return acc.concat(`\t+ ${key}: ${after}\n`);
  }, '{\n').concat('}');
};
/* eslint-enable arrow-body-style */

export const genDiff = (command, firstConfig, secondConfig) => {
  const beforeAST = parse(firstConfig);
  const afterAST = parse(secondConfig);
  const diffAST = makeDiff(beforeAST, afterAST);
  return diffToString(diffAST);
};

export const gendiff = (command, readFile = fs.readFileSync) => {
  const firstConfigFullPath = command.args[0];
  const secondConfigFullPath = command.args[1];

  console.log(`Arg[0]: ${command.args[0]}`);
  console.log(`Arg[1]: ${command.args[1]}`);

  const firstConfig = readFile(new URL(`file://${firstConfigFullPath}`), 'utf-8');
  const secondConfig = readFile(new URL(`file://${secondConfigFullPath}`), 'utf-8');

  return genDiff(command, firstConfig, secondConfig);
};

export default gendiff;
