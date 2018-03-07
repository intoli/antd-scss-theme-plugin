import { loadScssThemeAsLess } from './utils';
import { getScssThemePath } from './loaderUtils';


/**
 * Add or rewrite less-loader's modifyVars option with scss theme's variable customizations.
 * @param {Object} options - Options for less-loader.
 * @return {Objects} Options modified to include theme variables in the modifyVars property.
 */
export const overloadLessLoaderOptions = (options) => {
  const scssThemePath = getScssThemePath(options);

  const themeModifyVars = loadScssThemeAsLess(scssThemePath)
  const modifyVars = options.modifyVars || {};

  options.modifyVars = {
    ...themeModifyVars,
    ...modifyVars,
  };

  return options;
};
