import yamlParser from 'js-yaml';
import iniParser from 'ini';

const parsers = {
  json: JSON.parse,
  yml: yamlParser.safeLoad,
  yaml: yamlParser.safeLoad,
  ini: iniParser.parse,
};

const parseConfigFile = (configData, extension = 'json') => {
  const parse = parsers[extension];
  return parse(configData);
};

export default parseConfigFile;

