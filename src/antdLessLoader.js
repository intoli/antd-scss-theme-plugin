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
 * A wrapper around less-loader whose only additional functionality is to register the theme file
 * as a watched dependency. The loader options should already be modified so that any custom theme
 * variables are passed in through the modifyVars option.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */
export default function antdLessLoader(...args) {
  const loaderContext = this;
  const options = getOptions(loaderContext);
  const scssThemePath = getScssThemePath(options);

  loaderContext.addDependency(scssThemePath);

  return lessLoader.call(loaderContext, ...args);
}
