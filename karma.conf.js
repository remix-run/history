var webpack = require('webpack');

module.exports = function (config) {
  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '39'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '31'
    },
    'SL_Safari': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8'
    },
    'SL_IE_9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    'SL_IE_10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    'SL_iOS': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '8.1'
    }
  };

  config.set({
    customLaunchers: customLaunchers,

    browsers: [ 'Chrome' ],
    browserNoActivityTimeout: 30000,
    captureTimeout: 30000,
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha' ],

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

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

  if (process.env.USE_SAUCE) {
    config.browsers = Object.keys(customLaunchers);
    config.reporters = [ 'dots' ];

    // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs
    config.browserNoActivityTimeout = 120000;

    // Allocating a browser in Sauce Labs can take a while (e.g. if we are out of
    // capacity and need to wait for another build to finish) so captureTimeout
    // typically kills an in-queue-pending request, which makes no sense.
    config.captureTimeout = 0;

    config.sauceLabs = {
      testName: 'history',
      startConnect: false
    };
  } else if (process.env.TRAVIS) {
    config.browsers = Object.keys(customLaunchers);
    config.reporters = [ 'saucelabs' ];

    // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs
    config.browserNoActivityTimeout = 120000;

    // Allocating a browser in Sauce Labs can take a while (e.g. if we are out of
    // capacity and need to wait for another build to finish) so captureTimeout
    // typically kills an in-queue-pending request, which makes no sense.
    config.captureTimeout = 0;

    var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

    config.sauceLabs = {
      testName: 'history',
      build: buildLabel,
      startConnect: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      recordScreenshots: false
    };

    config.singleRun = true;
  }
};
