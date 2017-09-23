const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  cache: true,

  entry: path.resolve(__dirname, 'src/index.js'),

  output: {
    path: path.resolve(__dirname),
    filename: 'dist/app.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },

  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true
  },

  node: { fs: 'empty' },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader?cacheDirectory',
        include: [
          path.resolve(__dirname, 'src')
        ]
      },

      {
        test: /\.css$/,
        loader: 'style-loader!typings-for-css-modules-loader?modules&namedExport&camelCase&localIdentName=[name]__[local]'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
};
