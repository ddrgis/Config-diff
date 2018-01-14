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
  },
  deleted: {
    getNodeProps: previousValue => ({ previousValue }),
  },
  added: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
  },
  notChanged: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
  },
  changed: {
    getNodeProps: (previousValue, newValue) => ({ newValue, previousValue }),
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
