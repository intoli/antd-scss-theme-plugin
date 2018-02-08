import scssToJson from 'scss-to-json';


/**
 * Read variables from a scss theme file into a less-formatted dictionary.
 */
export const loadScssThemeAsLess = (filePath) => {
  const rawTheme = scssToJson(filePath);
  const theme = {};
  Object.keys(rawTheme).forEach((sassVariableName) => {
    const lessVariableName = sassVariableName.replace(/^\$/, '@');
    theme[lessVariableName] = rawTheme[sassVariableName];
  });
  return theme;
};
