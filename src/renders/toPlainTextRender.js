import _ from 'lodash';

const nodeTypes = {
  internalNode: ({ children, fullName }, toPlainTextFunc) => toPlainTextFunc(children, fullName),
  deleted: ({ fullName }) => `Property '${fullName}' was removed`,
  added: ({ fullName, complexValue, newValue }) =>
    `Property '${fullName}' was added with ${complexValue === 'complex value' ? complexValue : 'value: \''.concat(newValue).concat('\'')}`,
  notChanged: () => '',
  changed: ({ fullName, oldValue, newValue }) =>
    `Property '${fullName}' was updated. From '${oldValue}' to '${newValue}'`,
};

const toPlainText = (ast, parentName) => ast.reduce((acc, node) => {
  const { name, newValue, type } = node;
  const fullName = parentName ? `${parentName}.${name}` : name;
  const complexValue = _.isObject(newValue) ? 'complex value' : newValue;
  return [...acc, nodeTypes[type]({ ...node, fullName, complexValue }, toPlainText)];
}, []).filter(line => line).join('\n');

export default toPlainText;

