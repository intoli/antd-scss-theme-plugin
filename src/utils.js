import fs from 'fs';

import less from 'less';
import scssToJson from 'scss-to-json';

import ExtractVariablesPlugin from './extractVariablesLessPlugin';


/**
 * Return values of compiled LESS variables from a compilable entry point.
 * @param {string} lessEntryPath - Root LESS file from which to extract variables.
 * @param {Object} variableOverrides - Variable overrides of the form { '@var': 'value' } to use
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
          javascriptEnabled: true,
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
 * @param {string} themeScssPath - Path to scss file containing only scss variables.
 * @return {Object} Object of the form { '@variable': 'value' }.
 */
export const loadScssThemeAsLess = (themeScssPath) => {
  const rawTheme = scssToJson(themeScssPath);
  const theme = {};
  Object.keys(rawTheme).forEach((sassVariableName) => {
    const lessVariableName = sassVariableName.replace(/^\$/, '@');
    theme[lessVariableName] = rawTheme[sassVariableName];
  });
  return theme;
};


/**
 * Use scss theme file to seed a full set of Ant Design's theme variables returned in scss.
 * @param {string} themeScssPath - Path to scss file containing scss variables meaningful to Ant
 *   Design.
 * @return {string} A string representing an scss file containing all the theme and color
 *   variables used in Ant Design.
 */
export const compileThemeVariables = (themeScssPath) => {
  const themeEntryPath = require.resolve('antd/lib/style/themes/default.less');
  const variableOverrides = themeScssPath ? loadScssThemeAsLess(themeScssPath) : {};

  return extractLessVariables(themeEntryPath, variableOverrides).then(variables => (
    Object.entries(variables)
      .map(([name, value]) => `$${name}: ${value};\n`)
      .join('')
  ));
};
