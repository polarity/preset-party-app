const path = require('path')
const nodeExternals = require('webpack-node-externals')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CSS_MAPS = true

module.exports = env => {
  return {
    target: 'node',
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.jsx', '.js', '.json', '.less'],
      alias: {
        style: path.resolve(__dirname, '../src/stylesheets'),
        env: path.resolve(__dirname, `../config/env_${env}.json`)
      }
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          // Transform our own .(less|css) files with PostCSS and CSS-modules
          test: /\.(less|css)$/,
          include: [path.resolve(__dirname, '../src/components')],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: { modules: true, sourceMap: CSS_MAPS, importLoaders: 1, minimize: true }
              },
              {
                loader: `postcss-loader`,
                options: {
                  sourceMap: CSS_MAPS,
                  plugins: () => {
                    autoprefixer({ browsers: [ 'last 2 versions' ] })
                  }
                }
              },
              {
                loader: 'less-loader',
                options: { sourceMap: CSS_MAPS }
              }
            ]
          })
        },
        {
          test: /\.(less|css)$/,
          exclude: [path.resolve(__dirname, '../src/components')],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: { sourceMap: CSS_MAPS, importLoaders: 1, minimize: true }
              },
              {
                loader: `postcss-loader`,
                options: {
                  sourceMap: CSS_MAPS,
                  plugins: () => {
                    autoprefixer({ browsers: [ 'last 2 versions' ] })
                  }
                }
              },
              {
                loader: 'less-loader',
                options: { sourceMap: CSS_MAPS }
              }
            ]
          })
        }
      ]
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === 'development' }),
      new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true,
        disable: false
      })
    ]
  }
}
