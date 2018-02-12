import fs from 'fs';


describe('Ant Design\'s theme file', () => {
  it('exists in the expected location', () => {
    const themePath = require.resolve('antd/lib/style/themes/default.less');
    const themeExists = fs.existsSync(themePath);
    expect(themeExists).toBe(true);
  });
});
