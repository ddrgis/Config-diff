import _ from 'lodash';

const getNodeType = (previousValue, newValue) => {
  if (_.isPlainObject(previousValue) && _.isPlainObject(newValue)) {
    return 'internalNode';
  }
  if (newValue === undefined) {
    return 'deleted';
  }
  if (previousValue === undefined) {
    return 'added';
  }
  if (newValue === previousValue) {
    return 'notChanged';
  }
  return 'changed';
};

const lineSeparator = '\n';
const getIndent = depth => (depth < 1 ? '' : '  '.repeat(depth));

const nodeTypes = {
  internalNode: {
    getNodeProps: (previousValue, newValue, parseSubtree) =>
      ({ children: parseSubtree(previousValue, newValue) }),
    toString: ({ name, children }, depth, renderFunc) => `${getIndent(depth + 1)}${name}: ${renderFunc(children, depth + 2)}`,
  },
  deleted: {
    getNodeProps: previousValue => ({ previousValue }),
    toString: ({ name, previousValue }, depth) => `${getIndent(depth)}- ${name}: ${previousValue}`,
  },
  added: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    toString: ({ name, newValue }, depth) => `${getIndent(depth)}+ ${name}: ${newValue}`,
  },
  notChanged: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    toString: ({ name, newValue }, depth) => `${getIndent(depth)}  ${name}: ${newValue}`,
  },
  changed: {
    getNodeProps: (previousValue, newValue) => ({ newValue, previousValue }),
    toString: ({ name, newValue, previousValue }, depth) => `${getIndent(depth)}+ ${name}: ${newValue}${lineSeparator}${getIndent(depth)}- ${name}: ${previousValue}`,
  },
};

const parse = (firstConfig, secondConfig) => {
  const allUniqNames = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)])
    .filter((value, index, self) => self.indexOf(value) === index);

  return _.reduce(allUniqNames, (acc, nodeName) => {
    const previousValue = firstConfig[nodeName];
    const newValue = secondConfig[nodeName];
    const type = getNodeType(previousValue, newValue);
    const nodeProps = nodeTypes[type].getNodeProps(previousValue, newValue, parse);
    return [...acc, { name: nodeName, type, ...nodeProps }];
  }, []);
};

const nodeObjectValueToString = (value, depth) => {
  const jsonStr = JSON.stringify(value, null, '    ');

  return jsonStr.split('\n').map((item, index) => {
    const newItem = index === 0 ? item : `${getIndent(depth)}${item}`;
    return newItem;
  }).join('\n');
};

export const render = (ast, depth = 1) => {
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
    }, depth, render);
  });
  return `{\n${nodes.join(lineSeparator).replace(/"/g, '')}\n${getIndent(depth - 1)}}`;
};

export default parse;
