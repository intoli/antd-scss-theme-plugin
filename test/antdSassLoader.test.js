import path from 'path';

import sass from 'node-sass';

import { themeImporter } from '../src/antdSassLoader';


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
