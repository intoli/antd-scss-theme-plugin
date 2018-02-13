import path from 'path';

import sass from 'node-sass';

import compileWebpack from './utils';
import antdSassLoader, {
  themeImporter,
  overloadSassLoaderOptions,
} from '../src/antdSassLoader';
import AntdScssThemePlugin from '../src/index';


describe('themeImporter', () => {
  it('produces an importer that allows importing compiled antd variables', (done) => {
    const themePath = path.resolve(__dirname, 'data/theme.scss');
    sass.render({
      file: path.resolve(__dirname, 'data/test.scss'),
      importer: themeImporter(themePath),
    }, (error, result) => {
      const compiledColor = result.css.toString().match(/background: (.*);/)[1]
      expect(compiledColor).toBe('#faad14');
      done();
    });
  });
});


describe('overloadSassLoaderOptions', () => {
  const importer = (url, previous, done) => { done(); };
  const scssThemePath = path.resolve(__dirname, 'data/theme.scss');

  it('adds an extra when given no importers', () => {
    const overloadedOptions = overloadSassLoaderOptions({
      scssThemePath,
    });
    expect(typeof overloadedOptions.importer).toBe('function');
  });

  [
    ['existing importer', importer],
    ['existing importer array', [importer]],
  ].forEach(([description, importer]) => {
    it(`adds an importer when given an ${description}`, () => {
      const overloadedOptions = overloadSassLoaderOptions({
        importer,
        scssThemePath,
      });

      expect(overloadedOptions.importer.length).toBe(2);
      overloadedOptions.importer.forEach(imp => expect(typeof imp).toBe('function'));
    });
  });

  it('uses scss theme path from plugin when not given one through options', () => {
    const plugin = new AntdScssThemePlugin(scssThemePath);
    const overloadedOptions = overloadSassLoaderOptions({});
    expect(typeof overloadedOptions.importer).toBe('function');
  });

  it('throws error when no scss theme path is supplied', () => {
    AntdScssThemePlugin.SCSS_THEME_PATH = null;
    expect(() => {
      overloadSassLoaderOptions({});
    }).toThrow(/scss theme file must be specified/);
  });
});


describe('antdSassLoader', () => {
  it('enables importing theme variables in scss processed with sass-loader', (done) => {
    const config = {
      entry: path.resolve(__dirname, 'data/test.scss'),
      output: {
        path: path.join(__dirname, 'output'),
        filename: 'antdSassLoader.bundle.js',
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              'raw-loader',
              AntdScssThemePlugin.themify({
                loader: 'sass-loader',
                options: {
                  scssThemePath: path.resolve(__dirname, 'data/theme.scss'),
                },
              }),
            ],
          },
        ],
      },
    };
    compileWebpack(config, done);
  });
});
