import AntdScssThemePlugin from './index';


/**
 * Get path to scss theme file specified in loader options or through the plugin's constructor.
 * @param {Object} options - Loader options.
 * @return {string} Path to scss theme file.
 */
export const getScssThemePath = (options) => {
  let scssThemePath;
  if ('scssThemePath' in options) {
    scssThemePath = options.scssThemePath;
  } else {
    scssThemePath = AntdScssThemePlugin.SCSS_THEME_PATH;
  }

  if (!scssThemePath) {
    throw 'Path to an scss theme file must be specified through the scssThemePath loader option, '
          'or passed to the plugin\'s constructor.';
  }

  return scssThemePath;
};
