const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const resolve = (...paths) => {
  return path.resolve(__dirname, '../', ...paths);
};

module.exports = (dir) => {
  return {
    stats: 'errors-only',
    mode: process.env.NODE_ENV,
    entry: {
      main: resolve(`${dir}/main.ts`),
    },
    output: {
      filename: 'js/[name]-[contenthash].js',
      assetModuleFilename: 'asset/[name]-[contenthash][ext]',
      path: resolve('dist'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': resolve(dir),
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: [resolve(dir)],
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.s?css$/,
          include: [resolve(dir)],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'global',
                  localIdentName: '[local]__[hash:base64:5]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|svg|gif)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      new HtmlWebpackPlugin({
        template: resolve('template.ejs'),
      }),
    ],
  };
};
