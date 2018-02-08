import fs from 'fs';

import less from 'less';

import ExtractVariablesPlugin from './extractVariablesLessPlugin';


/**
 * Return values of compiled LESS variables from a compilable entry point.
 * @param  {string} lessEntryPath - Root LESS file from which to extract variables.
 * @param  {Object} variableOverrides - Variable overrides of the form { '@var': 'value' } to use
 *   during compilation.
 * @return {Object} Object of the form { 'variable': 'value' }.
 */
const extractLessVariables = (lessEntryPath, variableOverrides = {}) => {
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


export default extractLessVariables;
