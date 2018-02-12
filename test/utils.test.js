import fs from 'fs';
import path from 'path';

import { extractLessVariables } from '../src/utils.js';


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
    });
  });
});
