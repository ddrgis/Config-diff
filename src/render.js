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
    return nodeTypes[node.type].toString({
      name: node.name,
      newValue,
      previousValue,
      children: node.children,
    }, depth, toJSON);
  });
  return `{\n${nodes.join(lineSeparator).replace(/"/g, '')}\n${getIndent(depth - 1)}}`;
};

const toPlainText = ast => ast.toString();

const render = (ast, outputFormat = 'json') => {
  const renders = {
    json: toJSON,
    plain: toPlainText,
  };

  return renders[outputFormat] === undefined ? renders.json(ast) : renders[outputFormat](ast);
};

export default render;
