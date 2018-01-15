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

// тут получше имя не придумал...
const nodeTypes = {
  internalNode: (previousValue, newValue, parseSubtree) =>
    ({ children: parseSubtree(previousValue, newValue) }),
  deleted: previousValue => ({ previousValue }),
  added: (previousValue, newValue) => ({ newValue }),
  notChanged: (previousValue, newValue) => ({ newValue }),
  changed: (previousValue, newValue) => ({ newValue, previousValue }),
};

const parse = (firstConfig, secondConfig) => {
  const allUniqNames = _.flatten([Object.keys(firstConfig), Object.keys(secondConfig)])
    .filter((value, index, self) => self.indexOf(value) === index);

  return _.reduce(allUniqNames, (acc, nodeName) => {
    const previousValue = firstConfig[nodeName];
    const newValue = secondConfig[nodeName];
    const type = getNodeType(previousValue, newValue);
    const nodeProps = nodeTypes[type](previousValue, newValue, parse);
    return [...acc, { name: nodeName, type, ...nodeProps }];
  }, []);
};

export default parse;
