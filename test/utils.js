import webpack from 'webpack';


/**
 * Utility to compile webpack in a jest test and report back any errors.
 * @param {Object} config - A webpack configuration object.
 * @param {function} done - jest's done callback that is called when compilation completes.
 */
const compileWebpack = (config, done) => {
  webpack(config, (compilerError, stats) => {
    const error = compilerError || (stats.hasErrors() && stats.compilation.errors[0]);
    if (error) {
      done.fail(error);
      done();
    } else {
      done();
    }
  });
};


export default compileWebpack;
