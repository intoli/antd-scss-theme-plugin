import fs from 'fs';

import less from 'less';
import scssToJson from 'scss-to-json';

import ExtractVariablesPlugin from './extractVariablesLessPlugin';


/**
 * Return values of compiled LESS variables from a compilable entry point.
 * @param  {string} lessEntryPath - Root LESS file from which to extract variables.
 * @param  {Object} variableOverrides - Variable overrides of the form { '@var': 'value' } to use
 *   during compilation.
 * @return {Object} Object of the form { 'variable': 'value' }.
 */
export const extractLessVariables = (lessEntryPath, variableOverrides = {}) => {
  const lessEntry = fs.readFileSync(lessEntryPath, 'utf8');
  return new Promise(async (resolve, reject) => {
    try {
      await less.render(
        lessEntry,
        {
          filename: lessEntryPath,
          modifyVars: variableOverrides,
          plugins: [
            new ExtractVariablesPlugin({
              callback: variables => resolve(variables),
            }),
          ],
        },
      );
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Read variables from a scss theme file into a less-formatted dictionary.
 */
export const loadScssThemeAsLess = (filePath) => {
  const rawTheme = scssToJson(filePath);
  const theme = {};
  Object.keys(rawTheme).forEach((sassVariableName) => {
    const lessVariableName = sassVariableName.replace(/^\$/, '@');
    theme[lessVariableName] = rawTheme[sassVariableName];
  });
  return theme;
};
