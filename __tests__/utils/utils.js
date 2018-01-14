import fs from 'fs';
import path from 'path';

export const readFixtureFile = fileName => fs.readFileSync(path.join(__dirname, `../__fixtures__/${fileName}`), 'utf-8');
export const getPathToFixtures = fileName => `./__tests__/__fixtures__/${fileName}`;
