const getBaseConf = require('./webpack.config.base');
const getDevConf = require('./webpack.config.dev');

module.exports = (env) => {
  return Object.assign({}, getBaseConf(env.dir), getDevConf());
};
