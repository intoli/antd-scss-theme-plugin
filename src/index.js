import { overloadSassLoaderOptions } from './antdSassLoader';
import { overloadLessLoaderOptions } from './antdLessLoader';


class AntdScssThemePlugin {
  SCSS_THEME_PATH;

  constructor(scssThemePath) {
    AntdScssThemePlugin.SCSS_THEME_PATH = scssThemePath;
  }

  apply(compiler) {
    const afterEmit = (compilation, callback) => {
      // Watch the theme file for changes.
      const theme = AntdScssThemePlugin.SCSS_THEME_PATH;
      if (compilation.fileDependencies && !compilation.fileDependencies.includes(theme)) {
        compilation.fileDependencies.push(theme);
      }
      callback();
    };

    // Register the callback for...
    if (compiler.hooks) {
      // ... webpack 4, or...
      const plugin = { name: 'AntdScssThemePlugin' };
      compiler.hooks.afterEmit.tapAsync(plugin, afterEmit);
    } else {
      // ... webpack 3.
      compiler.plugin('after-emit', afterEmit);
    }
  }

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
