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

const toStringFormat = (ast, depth = 1) => {
  const nodes = ast.map((node) => {
    const previousValue = _.isObject(node.previousValue) ?
      nodeObjectValueToString(node.previousValue, depth + 1)
      : node.previousValue;
    const newValue = _.isObject(node.newValue) ?
      nodeObjectValueToString(node.newValue, depth + 1)
      : node.newValue;

    switch (node.type) {
      case 'internalNode':
        return `${getIndent(depth + 1)}${node.name}: ${toStringFormat(node.children, depth + 2)}`;
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

const toPlainText = (ast, parentName) => ast.reduce((acc, {
  name, type, newValue, previousValue, children,
}) => {
  const fullName = parentName ? `${parentName}.${name}` : name;
  const complexValue = _.isObject(newValue) ? 'complex value' : newValue;

  switch (type) {
    case 'internalNode':
      return [...acc, toPlainText(children, fullName)];
    case 'deleted':
      return [...acc, `Property '${fullName}' was removed`];
    case 'added':
      return [...acc, `Property '${fullName}' was added with ${complexValue === 'complex value' ? complexValue : 'value: \''.concat(newValue).concat('\'')}`];
    case 'changed':
      return [...acc, `Property '${fullName}' was updated. From '${previousValue}' to '${newValue}'`];
    default:
    case 'notChanged':
      return [...acc];
  }
}, []).filter(line => line).join('\n');

const toJSON = (ast) => {
  const jsonData = ast.reduce((acc, {
    name, type, newValue, previousValue, children,
  }) => {
    switch (type) {
      case 'internalNode':
        return { ...acc, [name]: toJSON(children) };
      case 'deleted':
        return { ...acc, [name]: { was: type, previousValue } };
      case 'added':
        return { ...acc, [name]: { was: type, newValue } };
      case 'changed':
        return { ...acc, [name]: { was: type, from: previousValue, to: newValue } };
      default:
      case 'notChanged':
        return { ...acc, [name]: { was: type, value: newValue } };
    }
  }, {});
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
