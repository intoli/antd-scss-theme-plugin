import path from 'path';

import { overloadLessLoaderOptions } from '../src/antdLessLoader';


describe('overloadLessLoaderOptions', () => {
  it('adds all variables from the scss theme file to the modifyVars property', () => {
    const overloadedOptions = overloadLessLoaderOptions({
      scssThemePath: path.resolve(__dirname, 'data/theme.scss'),
    });
    expect(overloadedOptions.modifyVars).toEqual({
      '@primary-color': '#f00',
      '@info-color': '#200',
    });
  });

  it('retains explicity passed in modifyVars', () => {
    const overloadedOptions = overloadLessLoaderOptions({
      scssThemePath: path.resolve(__dirname, 'data/theme.scss'),
      modifyVars: {
        '@primary-color': '#fff',
      }
    });
    expect(overloadedOptions.modifyVars).toEqual({
      '@primary-color': '#fff',
      '@info-color': '#200',
    });
  });
});
