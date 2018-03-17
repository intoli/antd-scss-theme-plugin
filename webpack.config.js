const path = require('path');

const nodeExternals = require('webpack-node-externals');

const packageJson = require('./package.json');


const webpackConfig = {
  devtool: 'cheap-module-source-map',
  entry: path.join(__dirname, 'src', 'index.js'),
  externals: [
    nodeExternals(),
    'antd',
    'less',
    'less-loader',
    'sass-loader',
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'build', 'dev'),
    filename: `${packageJson.name}.js`,
    library: 'AntdScssThemePlugin',
    libraryTarget: 'commonjs',
  },
  target: 'node',
};


module.exports = webpackConfig;
