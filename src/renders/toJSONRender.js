const nodeTypes = {
  internalNode: ({ name, children }, toJSONFunc) => ({ [name]: toJSONFunc(children) }),
  deleted: ({ oldValue, ...node }) => ({ [node.name]: { was: node.type, oldValue } }),
  added: ({ newValue, ...node }) => ({ [node.name]: { was: node.type, newValue } }),
  notChanged: ({ newValue, ...node }) => ({ [node.name]: { was: node.type, value: newValue } }),
  changed: node => ({ [node.name]: { was: node.type, from: node.oldValue, to: node.newValue } }),
};

const toJSON = (ast) => {
  const jsonData = ast.reduce((acc, node) =>
    ({ ...acc, ...nodeTypes[node.type](node, toJSON) }), {});
  return jsonData;
};

export default toJSON;
