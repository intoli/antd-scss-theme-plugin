const path = require('path');

const nodeExternals = require('webpack-node-externals');


const developmentOptions = {
  entry: path.join(__dirname, 'src', 'index.js'),
  externals: [
    nodeExternals(),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs',
  },
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
  target: 'node',
  devtool: 'cheap-module-source-map',
  node: {
    __dirname: true,
  },
};


module.exports = developmentOptions;
