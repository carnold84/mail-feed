const name = 'Feedify';

module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = name;
      return args;
    });
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
  },
  pwa: {
    name,
    msTileColor: '#a437c9',
    themeColor: '#a437c9',
  },
  transpileDependencies: ['quasar'],
};
