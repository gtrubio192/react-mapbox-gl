const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',

  entry: {
    app: './src/index.js'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { modules: true, exportOnlyLocals: false }
              },
              'sass-loader'
            ]
          },
          {
            use: ['style-loader', 'css-loader', 'sass-loader']
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                '@babel/react', 
                {
                  plugins: ['@babel/plugin-transform-runtime']
                }
              ]
            }
          }
        ]
      }
    ]
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new HtmlWebpackPlugin({title: 'NREL Interactive Map'}),
    new webpack.EnvironmentPlugin({MapboxAccessToken: ''}),
    new Dotenv()
  ]
};