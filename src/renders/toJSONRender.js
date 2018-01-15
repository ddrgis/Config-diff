const nodeTypes = {
  internalNode: {
    toJSON: ({ name, children }, toJSONFunc) => ({ [name]: toJSONFunc(children) }),
  },
  deleted: {
    toJSON: ({ name, type, oldValue }) => ({ [name]: { was: type, oldValue } }),
  },
  added: {
    toJSON: ({ name, type, newValue }) => ({ [name]: { was: type, newValue } }),
  },
  notChanged: {
    toJSON: ({ name, type, newValue }) => ({ [name]: { was: type, value: newValue } }),
  },
  changed: {
    toJSON: ({
      name, type, oldValue, newValue,
    }) => ({ [name]: { was: type, from: oldValue, to: newValue } }),
  },
};

const toJSON = (ast) => {
  const jsonData = ast.reduce((acc, node) =>
    ({ ...acc, ...nodeTypes[node.type].toJSON(node, toJSON) }), {});
  return jsonData;
};

export default toJSON;
