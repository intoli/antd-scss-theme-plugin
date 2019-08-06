import fs from 'fs';

import less from 'less';
import scssToJson from 'scss-to-json';

import ExtractVariablesPlugin from './extractVariablesLessPlugin';


/**
 * Return values of compiled Less variables from a compilable entry point.
 * @param {string} lessEntryPath - Root Less file from which to extract variables.
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
 * Read variables from a SCSS theme file into an object with Less-style variable names as keys.
 * @param {string} themeScssPath - Path to SCSS file containing only SCSS variables.
 * @return {Object} Object of the form { '@variable': 'value' }.
 */
export const loadScssThemeAsLess = (themeScssPath) => {
  let rawTheme;
  try {
    rawTheme = scssToJson(themeScssPath);
  } catch (error) {
    throw new Error(
      `Could not compile the SCSS theme file "${themeScssPath}" for the purpose of variable ` +
      'extraction. This is likely because it contains a Sass error.',
    );
  }
  const theme = {};
  Object.keys(rawTheme).forEach((sassVariableName) => {
    const lessVariableName = sassVariableName.replace(/^\$/, '@');
    theme[lessVariableName] = rawTheme[sassVariableName];
  });
  return theme;
};


/**
 * Use SCSS theme file to seed a full set of Ant Design's theme variables returned in SCSS.
 * @param {string} themeScssPath - Path to SCSS file containing SCSS variables meaningful to Ant
 *   Design.
 * @return {string} A string representing an SCSS file containing all the theme and color
 *   variables used in Ant Design.
 */
export const compileThemeVariables = (themeScssPath, entryPath = 'antd/lib/style/themes/default.less') => {
  const themeEntryPath = require.resolve(entryPath);
  const variableOverrides = themeScssPath ? loadScssThemeAsLess(themeScssPath) : {};

  return extractLessVariables(themeEntryPath, variableOverrides)
    .then(variables => (
      Object.entries(variables)
        .map(([name, value]) => `$${name}: ${value};\n`)
        .join('')
    ));
};
