/* eslint-env node */
module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./umd/history.production.min.js')
    : require('./umd/history.development.js');
