import toStringFormat from './toStringRender';
import toJSON from './toJSONRender';
import toPlainText from './toPlainTextRender';

const render = (ast, outputFormat = 'string') => {
  const renders = {
    string: toStringFormat,
    plain: toPlainText,
    json: toJSON,
  };

  return renders[outputFormat] === undefined ? renders.string(ast) : renders[outputFormat](ast);
};

export default render;
