import path from 'path';

import sass from 'node-sass';
import rimraf from 'rimraf';

import compileWebpack from '../src/testUtils';
import {
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
      const compiledColor = result.css.toString().match(/background: (.*);/)[1];
      expect(compiledColor).toBe('#faad14');
      done();
    });
  });
});


describe('overloadSassLoaderOptions', () => {
  const mockImporter = (url, previous, done) => { done(); };
  const scssThemePath = path.resolve(__dirname, 'data/theme.scss');

  it('adds an extra when given no importers', () => {
    const overloadedOptions = overloadSassLoaderOptions({
      scssThemePath,
    });
    expect(typeof overloadedOptions.importer).toBe('function');
  });

  [
    ['existing importer', mockImporter],
    ['existing importer array', [mockImporter]],
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
    // eslint-disable-next-line no-unused-vars
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
  const outputPath = path.join(__dirname, 'output');
  afterAll(() => {
    rimraf(path.join(outputPath, '**'), (error) => {
      if (error) {
        console.error(error);
      }
    });
  });

  it('enables importing theme variables in scss processed with sass-loader', (done) => {
    const config = {
      entry: path.resolve(__dirname, 'data/test.scss'),
      output: {
        path: outputPath,
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
