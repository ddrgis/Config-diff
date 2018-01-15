const nodeTypes = {
  internalNode: ({ name, children }, toJSONFunc) => ({ [name]: toJSONFunc(children) }),
  deleted: ({ name, type, oldValue }) => ({ [name]: { was: type, oldValue } }),
  added: ({ name, type, newValue }) => ({ [name]: { was: type, newValue } }),
  notChanged: ({ name, type, newValue }) => ({ [name]: { was: type, value: newValue } }),
  changed: ({
    name, type, oldValue, newValue,
  }) => ({ [name]: { was: type, from: oldValue, to: newValue } }),
};

const toJSON = (ast) => {
  const jsonData = ast.reduce((acc, node) =>
    ({ ...acc, ...nodeTypes[node.type](node, toJSON) }), {});
  return jsonData;
};

export default toJSON;
