var jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = {
  userAgent: 'jsdom'
};
