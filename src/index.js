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

  static themify({ loader, options = {} }) {
    let overloadedLoader;
    switch (loader) {
      case 'sass-loader':
        overloadedLoader = require.resolve('./antdSassLoader.js');
        break;
      case 'less-loader':
        overloadedLoader = require.resolve('./antdLessLoader.js');
        break;
      default:
        overloadedLoader = loader;
        break;
    }

    return {
      loader: overloadedLoader,
      options,
    };
  }
}


export default AntdScssThemePlugin;
