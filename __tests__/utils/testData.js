export const flatAST = [
  {
    name: 'host', type: 'notChanged', newValue: 'hexlet.io',
  },
  {
    name: 'timeout', type: 'changed', newValue: 20, previousValue: 50,
  },
  {
    name: 'proxy', type: 'deleted', previousValue: '123.234.53.22',
  },
  {
    name: 'verbose', type: 'added', newValue: true,
  },
];

export const bigTreelikeAST = [
  {
    name: 'common',
    type: 'internalNode',
    children: [
      { name: 'setting1', type: 'notChanged', newValue: 'Value 1' },
      { name: 'setting2', type: 'deleted', previousValue: '200' },
      { name: 'setting3', type: 'notChanged', newValue: true },
      {
        name: 'setting6',
        type: 'internalNode',
        children: [
          { name: 'key', type: 'notChanged', newValue: 'value' },
          { name: 'ops', type: 'added', newValue: 'vops' },
        ],
      },
      { name: 'setting4', type: 'added', newValue: 'blah blah' },
      {
        name: 'setting5', type: 'added', newValue: { key5: 'value5' },
      },
    ],
  },
  {
    name: 'group1',
    type: 'internalNode',
    children: [
      {
        name: 'baz',
        type: 'changed',
        newValue: 'bars',
        previousValue: 'bas',
      },
      {
        name: 'foo',
        type: 'notChanged',
        newValue: 'bar',
      },
    ],
  },
  {
    name: 'group2',
    type: 'deleted',
    previousValue: { abc: '12345' },
  },
  {
    name: 'group3',
    type: 'added',
    newValue: { fee: '100500' },
  },
];
