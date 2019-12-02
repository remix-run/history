'use strict';

module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./build/umd/history.production.js')
    : require('./build/umd/history.development.js');
