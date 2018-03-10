import lessLoader from 'less-loader';
import { getOptions } from 'loader-utils';

import { loadScssThemeAsLess } from './utils';
import { getScssThemePath } from './loaderUtils';


/**
 * Add or rewrite less-loader's modifyVars option with scss theme's variable customizations.
 * @param {Object} options - Options for less-loader.
 * @return {Objects} Options modified to include theme variables in the modifyVars property.
 */
export const overloadLessLoaderOptions = (options) => {
  const scssThemePath = getScssThemePath(options);

  const themeModifyVars = loadScssThemeAsLess(scssThemePath);
  const newOptions = {
    ...options,
    modifyVars: {
      ...themeModifyVars,
      ...(options.modifyVars || {}),
    },
  };

  return newOptions;
};


/**
 * A wrapper around less-loader which overloads loader options and registers the theme file
 * as a watched dependency.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */
export default function antdLessLoader(...args) {
  const loaderContext = this;
  const options = getOptions(loaderContext);

  const newLoaderContext = { ...loaderContext };
  const newOptions = overloadLessLoaderOptions(options);
  newLoaderContext.query = newOptions;

  const scssThemePath = getScssThemePath(options);
  newLoaderContext.addDependency(scssThemePath);

  return lessLoader.call(newLoaderContext, ...args);
}
