/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');

const plugins = [
  new webpack.ProvidePlugin({
    _: 'lodash',
  }),
];

module.exports = {
  outputDir: '../public',
  devServer: {
    contentBase: path.join(__dirname, '../public'),
    compress: true,
    port: process.env.VUE_APP_PORT || 8118,
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader');
  },
  configureWebpack: {
    plugins,
    devtool: 'source-map',
  },
  transpileDependencies: [
    'vuetify',
  ],
};
