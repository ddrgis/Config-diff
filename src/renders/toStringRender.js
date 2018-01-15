import _ from 'lodash';

const lineSeparator = '\n';
const getIndent = depth => (depth < 1 ? '' : '  '.repeat(depth));

const nodeTypes = {
  internalNode: ({ name, children }, depth, toStringFunc) =>
    `${getIndent(depth + 1)}${name}: ${toStringFunc(children, depth + 2)}`,
  deleted: ({ name, oldValue }, depth) => `${getIndent(depth)}- ${name}: ${oldValue}`,
  added: ({ name, newValue }, depth) => `${getIndent(depth)}+ ${name}: ${newValue}`,
  notChanged: ({ name, newValue }, depth) => `${getIndent(depth)}  ${name}: ${newValue}`,
  changed: ({ name, newValue, oldValue }, depth) =>
    `${getIndent(depth)}+ ${name}: ${newValue}\n${getIndent(depth)}- ${name}: ${oldValue}`,
};

const nodeObjectValueToString = (value, depth) => {
  const jsonString = JSON.stringify(value, null, '    ');

  return jsonString.split('\n').map((item, index) => {
    const newItem = index === 0 ? item : `${getIndent(depth)}${item}`;
    return newItem;
  }).join('\n');
};

const render = (ast, depth = 1) => {
  const nodes = ast.map((node) => {
    const oldValue = _.isObject(node.oldValue) ?
      nodeObjectValueToString(node.oldValue, depth + 1)
      : node.oldValue;
    const newValue = _.isObject(node.newValue) ?
      nodeObjectValueToString(node.newValue, depth + 1)
      : node.newValue;
    return nodeTypes[node.type]({ ...node, oldValue, newValue }, depth, render);
  });
  return `{\n${nodes.join(lineSeparator).replace(/"/g, '')}\n${getIndent(depth - 1)}}`;
};

export default render;
