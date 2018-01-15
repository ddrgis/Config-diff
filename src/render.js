import _ from 'lodash';

const lineSeparator = '\n';
const getIndent = depth => (depth < 1 ? '' : '  '.repeat(depth));

const nodeObjectValueToString = (value, depth) => {
  const jsonString = JSON.stringify(value, null, '    ');

  return jsonString.split('\n').map((item, index) => {
    const newItem = index === 0 ? item : `${getIndent(depth)}${item}`;
    return newItem;
  }).join('\n');
};

const nodeTypes = {
  internalNode: {
    toStringFormat: ({ name, children }, depth, toStringFunc) =>
      `${getIndent(depth + 1)}${name}: ${toStringFunc(children, depth + 2)}`,
    toPlainText: ({ children, fullName }, toPlainTextFunc) => toPlainTextFunc(children, fullName),
    toJSON: ({ name, children }, toJSONFunc) => ({ [name]: toJSONFunc(children) }),
  },
  deleted: {
    toStringFormat: ({ name, oldValue }, depth) => `${getIndent(depth)}- ${name}: ${oldValue}`,
    toPlainText: ({ fullName }) => `Property '${fullName}' was removed`,
    toJSON: ({ name, type, oldValue }) => ({ [name]: { was: type, oldValue } }),
  },
  added: {
    toStringFormat: ({ name, newValue }, depth) => `${getIndent(depth)}+ ${name}: ${newValue}`,
    toPlainText: ({ fullName, complexValue, newValue }) =>
      `Property '${fullName}' was added with ${complexValue === 'complex value' ? complexValue : 'value: \''.concat(newValue).concat('\'')}`,
    toJSON: ({ name, type, newValue }) => ({ [name]: { was: type, newValue } }),
  },
  notChanged: {
    toStringFormat: ({ name, newValue }, depth) => `${getIndent(depth)}  ${name}: ${newValue}`,
    toPlainText: () => '',
    toJSON: ({ name, type, newValue }) => ({ [name]: { was: type, value: newValue } }),
  },
  changed: {
    toStringFormat: ({ name, newValue, oldValue }, depth) =>
      `${getIndent(depth)}+ ${name}: ${newValue}\n${getIndent(depth)}- ${name}: ${oldValue}`,
    toPlainText: ({ fullName, oldValue, newValue }) =>
      `Property '${fullName}' was updated. From '${oldValue}' to '${newValue}'`,
    toJSON: ({
      name, type, oldValue, newValue,
    }) => ({ [name]: { was: type, from: oldValue, to: newValue } }),
  },
};

const toStringFormat = (ast, depth = 1) => {
  const nodes = ast.map((node) => {
    const oldValue = _.isObject(node.oldValue) ?
      nodeObjectValueToString(node.oldValue, depth + 1)
      : node.oldValue;
    const newValue = _.isObject(node.newValue) ?
      nodeObjectValueToString(node.newValue, depth + 1)
      : node.newValue;
    return nodeTypes[node.type]
      .toStringFormat({ ...node, oldValue, newValue }, depth, toStringFormat);
  });
  return `{\n${nodes.join(lineSeparator).replace(/"/g, '')}\n${getIndent(depth - 1)}}`;
};

const toPlainText = (ast, parentName) => ast.reduce((acc, node) => {
  const { name, newValue, type } = node;
  const fullName = parentName ? `${parentName}.${name}` : name;
  const complexValue = _.isObject(newValue) ? 'complex value' : newValue;
  return [...acc, nodeTypes[type].toPlainText({ ...node, fullName, complexValue }, toPlainText)];
}, []).filter(line => line).join('\n');

const toJSON = (ast) => {
  const jsonData = ast.reduce((acc, node) =>
    ({ ...acc, ...nodeTypes[node.type].toJSON(node, toJSON) }), {});
  return jsonData;
};

const render = (ast, outputFormat = 'string') => {
  const renders = {
    string: toStringFormat,
    plain: toPlainText,
    json: toJSON,
  };

  return renders[outputFormat] === undefined ? renders.string(ast) : renders[outputFormat](ast);
};

export default render;
