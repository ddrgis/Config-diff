import _ from 'lodash';
import { nodeTypes } from './ast';

const lineSeparator = '\n';
const getIndent = depth => (depth < 1 ? '' : '  '.repeat(depth));

const nodeObjectValueToString = (value, depth) => {
  const jsonStr = JSON.stringify(value, null, '    ');

  return jsonStr.split('\n').map((item, index) => {
    const newItem = index === 0 ? item : `${getIndent(depth)}${item}`;
    return newItem;
  }).join('\n');
};

const toJSON = (ast, depth = 1) => {
  const nodes = ast.map((node) => {
    const previousValue = _.isObject(node.previousValue) ?
      nodeObjectValueToString(node.previousValue, depth + 1)
      : node.previousValue;
    const newValue = _.isObject(node.newValue) ?
      nodeObjectValueToString(node.newValue, depth + 1)
      : node.newValue;

    switch (node.type) {
      case 'internalNode':
        return `${getIndent(depth + 1)}${node.name}: ${toJSON(node.children, depth + 2)}`;
      case 'deleted':
        return `${getIndent(depth)}- ${node.name}: ${previousValue}`;
      case 'added':
        return `${getIndent(depth)}+ ${node.name}: ${newValue}`;
      case 'notChanged':
        return `${getIndent(depth)}  ${node.name}: ${newValue}`;
      default:
      case 'changed':
        return `${getIndent(depth)}+ ${node.name}: ${newValue}\n${getIndent(depth)}- ${node.name}: ${previousValue}`;
    }
  });
  return `{\n${nodes.join(lineSeparator).replace(/"/g, '')}\n${getIndent(depth - 1)}}`;
};

const toPlainText = (ast, parentName) => {
  console.log(ast);
  return ast.reduce((acc, { name, type, newValue, previousValue, children }) => {
    const fullName = parentName ? `${parentName}.${name}` : name;
    const complexValue = _.isObject(newValue) ? 'complex value' : newValue;
    console.log(complexValue, newValue);
    return [...acc, nodeTypes[type].toPlain({ name: fullName, newValue: complexValue, previousValue, children }, toPlainText)];
  }, []).filter(line => line).join('\n');
};

const render = (ast, outputFormat = 'json') => {
  const renders = {
    json: toJSON,
    plain: toPlainText,
  };

  return renders[outputFormat] === undefined ? renders.json(ast) : renders[outputFormat](ast);
};

export default render;
