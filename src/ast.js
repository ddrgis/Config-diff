import _ from 'lodash';

const getNodeType = (previousValue, newValue) => {
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

const separator = ',\n  ';

const nodeTypes = {
  deleted: {
    getNodeProps: previousValue => ({ previousValue }),
    toString: self => `- ${self.name}: ${self.previousValue}`,
  },
  added: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    toString: self => `+ ${self.name}: ${self.newValue}`,
  },
  notChanged: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    toString: self => `  ${self.name}: ${self.newValue}`,
  },
  changed: {
    getNodeProps: (previousValue, newValue) => ({ newValue, previousValue }),
    toString: self => `+ ${self.name}: ${self.newValue}${separator}- ${self.name}: ${self.previousValue}`,
  },
};

const buildNode = (name, previousValue, newValue) => {
  const type = getNodeType(previousValue, newValue);
  const nodeProps = nodeTypes[type].getNodeProps(previousValue, newValue);
  return {
    name,
    type,
    ...nodeProps,
  };
};

const parse = (firstConfig, secondConfig) => {
  const allUniqNames = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)])
    .filter((value, index, self) => self.indexOf(value) === index);

  return _.reduce(allUniqNames, (acc, nodeName) => {
    const previousValue = firstConfig[nodeName];
    const newValue = secondConfig[nodeName];
    return [...acc, buildNode(nodeName, previousValue, newValue)];
  }, []);
};

export const render = (ast) => {
  const nodes = ast.map(node => nodeTypes[node.type].toString(node));
  return `{\n  ${nodes.join(separator).replace(/"/g, '')}\n}`;
};

export default parse;
