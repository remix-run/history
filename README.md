Not much to see here ... yet.

### Features

```js
//import createHistory from 'history'; // in-memory
//import createHashHistory from 'history'; // uses window.location.hash
import createBrowserHistory from 'history'; // uses HTML5 history API

var history = createBrowserHistory({
  getUserConfirmation(message, callback) {
    // Use this hook to get the user's confirmation that
    // they want to leave the current page.
    callback(window.confirm(message));
  }
});

// Use registerTransitionHook to register a function that
// returns a message when the user navigates away. Return
// nothing to allow the transition.
history.registerTransitionHook(function () {
  return 'Are you sure you want to leave this page?';
});

// Listen for changes to the page location. This is called
// once immediately.
history.listen(function (location) {
  location.key;
  location.state;
  location.pathname; 
  location.search;
  location.navigationType;
});

history.pushState(state, url);
history.replaceState(state, url);
history.go(-1);
history.goBack();
history.goForward();
```
