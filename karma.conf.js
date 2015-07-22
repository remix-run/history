var webpack = require('webpack');

module.exports = function (config) {
  var isTravis = !!process.env.TRAVIS;

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'SL_InternetExplorer': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
    }
  };

  config.set({
    browserNoActivityTimeout: 120000,

    browsers: isTravis ? Object.keys(customLaunchers) : [ 'Chrome' ],

    sauceLabs: {
      testName: 'history'
    },

    captureTimeout: 120000,

    customLaunchers: customLaunchers,

    singleRun: isTravis,

    frameworks: [ 'mocha' ],

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'dots' ],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }
  });
};
