import AntdScssThemePlugin from './index';


/**
 * Get path to SCSS theme file specified in loader options or through the plugin's constructor.
 * @param {Object} options - Loader options.
 * @return {string} Path to SCSS theme file.
 */
// eslint-disable-next-line import/prefer-default-export
export const getScssThemePath = (options) => {
  const scssThemePath = options.scssThemePath || AntdScssThemePlugin.SCSS_THEME_PATH;

  if (!scssThemePath) {
    throw new Error(
      'Path to an SCSS theme file must be specified through the scssThemePath loader option, ' +
      'or passed to the plugin\'s constructor.',
    );
  }

  return scssThemePath;
};
