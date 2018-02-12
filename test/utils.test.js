import fs from 'fs';
import path from 'path';

import {
  compileThemeVariables,
  extractLessVariables,
  loadScssThemeAsLess,
} from '../src/utils.js';


describe('Ant Design\'s theme file', () => {
  it('exists in the expected location', () => {
    const themePath = require.resolve('antd/lib/style/themes/default.less');
    const themeExists = fs.existsSync(themePath);
    expect(themeExists).toBe(true);
  });
});


describe('extractLessVariables', () => {
  it('should correctly extract computed variables', async () => {
    const extractedVariables = await extractLessVariables(
      path.resolve(__dirname, 'data/test.less')
    );
    expect(extractedVariables).toEqual({
      'test-color': '#f00',
      'computed-test-color': '#0f0',
      'test-url': '"http://localhost/image.png"',
    });
  });

  it('should properly overload variables', async () => {
    const extractedVariables = await extractLessVariables(
      path.resolve(__dirname, 'data/test.less'),
      {
        'computed-test-color': '#00f',
      },
    );
    expect(extractedVariables).toEqual({
      'test-color': '#f00',
      'computed-test-color': '#00f',
      'test-url': '"http://localhost/image.png"',
    });
  });
});


describe('loadScssThemeAsLess', () => {
  it('should correctly extract variables', () => {
    const scssThemePath = path.resolve(__dirname, 'data/theme.scss');
    const variables = loadScssThemeAsLess(scssThemePath);;
    expect(variables).toEqual({
      '@primary-color': '#f00',
      '@info-color': '#200',
    });
  })
});


describe('compileThemeVariables', () => {
  it('should produce the expected number of variables', async () => {
    const scssThemePath = path.resolve(__dirname, 'data/theme.scss');
    const output = await compileThemeVariables(scssThemePath);
    const variableCount = output.split('\n').filter(line => line.startsWith('$')).length;
    expect(variableCount).toBe(429);
  });
});
