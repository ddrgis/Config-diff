import parse from '../src/ast';

test('flat AST parsing', () => {
  const expectedFlatAST = [
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

  const firstConfig = { host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22' };
  const secondConfig = { timeout: 20, verbose: true, host: 'hexlet.io' };

  expect(parse(firstConfig, secondConfig)).toEqual(expectedFlatAST);
});
