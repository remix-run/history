'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./umd/history.min.js');
} else {
  module.exports = require('./umd/history.js');
}
