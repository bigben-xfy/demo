const path = require('path');
const resolve = (...paths) => {
  return path.resolve(__dirname, '../', ...paths);
};

module.exports = () => {
  return {
    mode: 'development',
    output: {
      filename: 'js/[name].js',
      assetModuleFilename: 'asset/[name][ext]',
      path: resolve('dist'),
    },
    devtool: 'eval-source-map',
    watchOptions: {
      ignored: /node_modules/,
    },
    devServer: {
      contentBase: resolve('dist'),
      port: 9000,
    },
  };
};
