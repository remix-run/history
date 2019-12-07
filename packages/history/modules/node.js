/* eslint-env node */
module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./history.production.min.js')
    : require('./history.development.js');
