class AntdScssThemePlugin {
  constructor(options) {
    console.log(options);
  }

  // eslint-disable-next-line
  apply(compiler) {}

  static enhance(loader, options) {
    return {
      loader,
      options,
    };
  }
}


export default AntdScssThemePlugin;
