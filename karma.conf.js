var path = require('path');
var webpack = require('webpack');
var projectName = require('./package').name;

module.exports = function(config) {
  var customLaunchers = {
    BS_Chrome: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'Chrome',
      browser_version: '73.0'
    },
    // BS_ChromeAndroid: {
    //   base: 'BrowserStack',
    //   device: 'Samsung Galaxy S8',
    //   os_version: '7.0',
    //   real_mobile: true
    // },
    BS_Firefox: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'Firefox',
      browser_version: '67.0'
    },
    BS_Edge: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'Edge',
      browser_version: '17.0'
    },
    BS_IE11: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'IE',
      browser_version: '11.0'
    },
    BS_Safari: {
      base: 'BrowserStack',
      os: 'OS X',
      os_version: 'Mojave',
      browser: 'Safari',
      browser_version: '12.1'
    }
    // BS_iPhoneX: {
    //   base: 'BrowserStack',
    //   device: 'iPhone X',
    //   os_version: '11',
    //   real_mobile: true
    // },
    // BS_iPhoneXS: {
    //   base: 'BrowserStack',
    //   device: 'iPhone XS',
    //   os_version: '12',
    //   real_mobile: true
    // },
  };

  var historyAlias;
  switch (process.env.TEST_ENV) {
    case 'cjs':
      historyAlias = 'cjs/history.js';
      break;
    case 'umd':
      historyAlias = 'umd/history.js';
      break;
    case 'source':
    default:
      historyAlias = 'modules/index.js';
  }

  config.set({
    customLaunchers: customLaunchers,
    browsers: ['Chrome' /*, 'Firefox'*/],
    frameworks: ['mocha'],
    reporters: ['mocha'],
    files: ['tests.webpack.js'],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      },
      resolve: {
        alias: {
          history$: path.resolve(__dirname, historyAlias)
        }
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

  if (process.env.USE_CLOUD) {
    config.browsers = Object.keys(customLaunchers);
    config.reporters = ['dots'];
    config.concurrency = 2;
    config.browserDisconnectTimeout = 10000;
    config.browserDisconnectTolerance = 3;

    if (process.env.TRAVIS) {
      config.singleRun = true;
      config.browserStack = {
        project: projectName,
        build: process.env.TRAVIS_BUILD_NUMBER,
        name: process.env.TRAVIS_JOB_NUMBER
      };
    } else {
      config.browserStack = {
        project: projectName
      };
    }
  }
};
