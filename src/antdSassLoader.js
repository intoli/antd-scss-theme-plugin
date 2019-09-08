import path from 'path';

import { getOptions, urlToRequest } from 'loader-utils';
import sassLoader from 'sass-loader';
import importsToResolve from 'sass-loader/dist/importsToResolve';

import { getScssThemePath } from './loaderUtils';
import {
  compileThemeVariables,
} from './utils';


/**
 * Utility returning a node-sass importer that provides access to all of antd's theme variables.
 * @param {string} themeScssPath - Path to SCSS file containing Ant Design theme variables.
 * @param {string} contents - The compiled content of the SCSS file at themeScssPath.
 * @returns {function} Importer that provides access to all compiled Ant Design theme variables
 *   when importing the theme file at themeScssPath.
 */
export const themeImporter = (themeScssPath, contents) => (url, previousResolve, done) => {
  const request = urlToRequest(url);
  const pathsToTry = importsToResolve(request);

  const baseDirectory = path.dirname(previousResolve);
  for (let i = 0; i < pathsToTry.length; i += 1) {
    const potentialResolve = pathsToTry[i];
    if (path.resolve(baseDirectory, potentialResolve) === themeScssPath) {
      done({ contents });
      return;
    }
  }
  done();
};


/**
 * Modify sass-loader's options so that all antd variables are imported from the SCSS theme file.
 * @param {Object} options - Options for sass-loader.
 * @return {Object} Options modified to includ a custom importer that handles the SCSS theme file.
 */
export const overloadSassLoaderOptions = async (options) => {
  const newOptions = { ...options };
  const scssThemePath = getScssThemePath(options);

  const contents = await compileThemeVariables(scssThemePath);
  const extraImporter = themeImporter(scssThemePath, contents);

  let importer;
  if ('importer' in options) {
    if (Array.isArray(options.importer)) {
      importer = [...options.importer, extraImporter];
    } else {
      importer = [options.importer, extraImporter];
    }
  } else {
    importer = extraImporter;
  }

  newOptions.importer = importer;

  return newOptions;
};


/**
 * A wrapper around sass-loader which overloads loader options to include a custom importer handling
 * variable imports from the SCSS theme file, and registers the theme file as a watched dependency.
 * @param {...*} args - Arguments passed to sass-loader.
 * @return {undefined}
 */
export default function antdSassLoader(...args) {
  const loaderContext = this;
  const callback = loaderContext.async();
  const options = getOptions(loaderContext);

  const newLoaderContext = { ...loaderContext };

  overloadSassLoaderOptions(options)
    .then((newOptions) => {
      delete newOptions.scssThemePath; // eslint-disable-line no-param-reassign
      newLoaderContext.query = newOptions;

      const scssThemePath = getScssThemePath(options);
      newLoaderContext.addDependency(scssThemePath);

      return sassLoader.call(newLoaderContext, ...args);
    })
    .catch((error) => {
      // Remove unhelpful stack from error.
      error.stack = undefined; // eslint-disable-line no-param-reassign
      callback(error);
    });
}
