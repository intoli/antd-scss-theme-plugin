import path from 'path';

import { urlToRequest } from 'loader-utils';
import importsToResolve from 'sass-loader/lib/importsToResolve';

import {
  extractLessVariables,
  compileThemeVariables,
} from './utils';


/**
 * Utility returning a node-sass importer that provides access to all Ant Design theme variables.
 * @param {string} themeScssPath - Path to scss file containing Ant Design theme variables.
 * @returns {function} Importer that provides access to all compiled Ant Design theme variables
 *   when importing the theme file at themeScssPath.
 */
export const themeImporter = themeScssPath => (url, previousResolve, done) => {
  const request = urlToRequest(url);
  const pathsToTry = importsToResolve(request);

  const baseDirectory = path.dirname(previousResolve);
  for (let i = 0; i < pathsToTry.length; i += 1) {
    const potentialResolve = pathsToTry[i];
    if (path.resolve(baseDirectory, potentialResolve) === themeScssPath) {
      compileThemeVariables(themeScssPath).then(contents => done({ contents }));
      return;
    }
  }
  done();
};
