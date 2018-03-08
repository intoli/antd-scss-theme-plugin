import { overloadSassLoaderOptions } from './antdSassLoader';
import { overloadLessLoaderOptions } from './antdLessLoader';


class AntdScssThemePlugin {
  SCSS_THEME_PATH;

  constructor(scssThemePath) {
    AntdScssThemePlugin.SCSS_THEME_PATH = scssThemePath;
  }

  // eslint-disable-next-line
  apply(compiler) {}

  static themify({ loader, options, overloadLoader = true }) {
    let overloadedLoader;
    let overloadedOptions;
    switch (loader) {
      case 'sass-loader':
        if (overloadLoader) {
          overloadedLoader = require.resolve('./antdSassLoader.js');
        }
        overloadedOptions = overloadSassLoaderOptions(options);
        break;
      case 'less-loader':
        if (overloadLoader) {
          overloadedLoader = require.resolve('./antdLessLoader.js');
        }
        overloadedOptions = overloadLessLoaderOptions(options);
        break;
      default:
        overloadedLoader = loader;
        overloadedOptions = options || {};
        break;
    }

    return {
      loader: overloadedLoader,
      options: overloadedOptions,
    };
  }
}


export default AntdScssThemePlugin;
