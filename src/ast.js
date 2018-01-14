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

export const nodeTypes = {
  internalNode: {
    getNodeProps: (previousValue, newValue, parseSubtree) =>
      ({ children: parseSubtree(previousValue, newValue) }),
    toPlain: ({ name, children }, subtreeRenderFunc) => subtreeRenderFunc(children, name),
  },
  deleted: {
    getNodeProps: previousValue => ({ previousValue }),
    toPlain: ({ name }) => `Property '${name}' was removed`,
  },
  added: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    toPlain: ({ name, newValue }) => `Property '${name}' was added with ${newValue === 'complex value' ? newValue : 'value: \''.concat(newValue).concat('\'')}`,
  },
  notChanged: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    toPlain: () => '',
  },
  changed: {
    getNodeProps: (previousValue, newValue) => ({ newValue, previousValue }),
    toPlain: ({ name, newValue, previousValue }) => `Property '${name}' was updated. From '${previousValue}' to '${newValue}'`,
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

export default parse;
