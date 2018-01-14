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

const nodeTypes = {
  // internalNode: {
  //   getNewValue: () => null,
  //   // getChildren:
  // },
  deleted: {
    getNodeProps: previousValue => ({ previousValue }),
    // getChildren: previousValue => (typeof previousValue === 'object' ? previousValue : []),
  },
  added: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    // getChildren: (previousValue, newValue) => (typeof newValue === 'object' ? newValue : []),
  },
  notChanged: {
    getNodeProps: (previousValue, newValue) => ({ newValue }),
    // getChildren: previousValue => (typeof previousValue === 'object' ? previousValue : []),
  },
  changed: {
    getNodeProps: (previousValue, newValue) => ({ newValue, previousValue }),
    // getChildren: (previousValue, newValue) => (typeof newValue === 'object' ? newValue : []),
  },
};

const buildNode = (name, previousValue, newValue) => {
  const type = getNodeType(previousValue, newValue);
  const nodeProps = nodeTypes[type].getNodeProps(previousValue, newValue);
  // const children = nodeTypes[type].getChildren(previousValue, newValue);
  // const previousChildren = typeof previousValue === 'object' ? previousValue : [];
  // if (nodeProps === null) {
  //   return {
  //     name,
  //     newValue: nodeProps,
  //     type,
  //     children: _.reduce(children, (acc, childValue, childName) => ([
  //       ...acc,
  //       {
  //         children,
  //         newValue,
  //         type,
  //         [childName]: buildNode(name, previousChildren[childName], childValue),
  //       },
  //     ]), []),
  //   };
  // }
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

const separator = ',\n  ';

export const render = (ast) => {
  const nodes = ast.map((node) => {
    switch (node.type) {
      case 'added':
        return `+ ${node.name}: ${node.newValue}`;
      case 'deleted':
        return `- ${node.name}: ${node.previousValue}`;
      case 'notChanged':
        return `  ${node.name}: ${node.newValue}`;
      default:
        return `+ ${node.name}: ${node.newValue}${separator}- ${node.name}: ${node.previousValue}`;
    }
  });
  return `{\n  ${nodes.join(separator).replace(/"/g, '')}\n}`;
};

export default parse;
