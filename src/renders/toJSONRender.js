const buildJSONNode = ({ name, type }, values) => ({ [name]: { was: type, ...values } });

const nodeTypes = {
  internalNode: ({ name, children }, toJSONFunc) => ({ [name]: toJSONFunc(children) }),
  deleted: ({ oldValue, ...node }) => buildJSONNode(node, { oldValue }),
  added: ({ newValue, ...node }) => buildJSONNode(node, { newValue }),
  notChanged: ({ newValue, ...node }) => buildJSONNode(node, { value: newValue }),
  changed: ({ oldValue, newValue, ...node }) =>
    buildJSONNode(node, { from: oldValue, to: newValue }),
};

const toJSON = (ast) => {
  const jsonData = ast.reduce((acc, node) =>
    ({ ...acc, ...nodeTypes[node.type](node, toJSON) }), {});
  return jsonData;
};

export default toJSON;
