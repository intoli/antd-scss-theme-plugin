import path from 'path';
const fs = require('fs');
import { propOr } from 'ramda';
import { urlToRequest } from 'loader-utils';
import sassLoader from 'sass-loader';
import { getScssThemePath } from './loaderUtils';
import { compileThemeVariables } from './utils';
import { mergeRight } from 'ramda';

/**
 * Utility returning a node-sass importer that provides access to all of antd's theme variables.
 * @param {string} themeScssPath - Path to SCSS file containing Ant Design theme variables.
 * @param {string} contents - The compiled content of the SCSS file at themeScssPath.
 * @returns {function} Importer that provides access to all compiled Ant Design theme variables
 *   when importing the theme file at themeScssPath.
 */
export const themeImporter = (themeScssPath, contents) => (url, previousResolve, done) => {
  const request = urlToRequest(url);
  let pathsToFile;

  const baseDirectory = path.dirname(previousResolve);

  if (/\.(scss|sass)$/g.test(url)) {
    pathsToFile = request;
  } else {
    if (fs.existsSync(path.resolve(baseDirectory, `${request}.scss`))) {
      pathsToFile = request;
    } else if (fs.existsSync(path.resolve(baseDirectory, `${request}.sass`))) {
      pathsToFile = request;
    }
  }

  if (pathsToFile && path.resolve(baseDirectory, pathsToFile) === themeScssPath) {
    done({ contents });
    return;
  }
  done();
};


/**
 * Modify sass-loader's options so that all antd variables are imported from the SCSS theme file.
 * @param {Object} options - Options for sass-loader.
 * @return {Object} Options modified to include a custom importer that handles the SCSS theme file.
 */
export const overloadSassLoaderOptions = async (options) => {
  const newOptions = { ...options };
  const scssThemePath = getScssThemePath(options);

  const contents = await compileThemeVariables(scssThemePath);
  const extraImporter = themeImporter(scssThemePath, contents);
  const sassOptions = propOr({}, 'sassOptions', options);

  let importer;

  if ('importer' in sassOptions) {
    if (Array.isArray(sassOptions.importer)) {
      importer = [...sassOptions.importer, extraImporter];
    } else {
      importer = [sassOptions.importer, extraImporter];
    }
  } else {
    importer = extraImporter;
  }

  newOptions.sassOptions = {};
  newOptions.sassOptions.importer = importer;

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
  const options = this.getOptions();

  const newLoaderContext = {};

  overloadSassLoaderOptions(options)
    .then((newOptions) => {
      delete newOptions.scssThemePath; // eslint-disable-line no-param-reassign
      newLoaderContext.query = newOptions;
      newLoaderContext.getOptions = () => newOptions;

      const scssThemePath = getScssThemePath(options);
      const newContext = mergeRight(this, newLoaderContext);
      newContext.addDependency(scssThemePath);
      return sassLoader.call(newContext, ...args);
    })
    .catch((error) => {
      // Remove unhelpful stack from error.
      error.stack = undefined; // eslint-disable-line no-param-reassign
      callback(error);
    });
}
