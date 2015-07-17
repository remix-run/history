var jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = {
  userAgent: 'jsdom'
};

var storage = {};

global.window.sessionStorage = {
  getItem: function (key) {
    return storage[key];
  },
  setItem: function (key, data) {
    storage[key] = data;
  },
  removeItem: function (key) {
    delete storage[key];
  },
  clear: function () {
    storage = {};
  }
};
