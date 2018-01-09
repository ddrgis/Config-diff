import fs from 'fs';
import path from 'path';
// import _ from 'lodash';

const genDiff = (firstConfigPath, secondConfigPath) => {
  console.log(firstConfigPath);
  console.log(secondConfigPath);

  const diffResult = fs.readFileSync(path.join(__dirname, '../__tests__/__fixtures__/diff.json'), 'utf-8');

  console.log(diffResult);
  console.log(JSON.parse(JSON.stringify(diffResult)));

  return {};
};

export default genDiff;
