Not much to see here ... yet.

### Features

```js
import { createMemoryHistory } from 'history';  // in-memory
import { createHashHistory } from 'history';    // window.location.hash
import { createHistory } from 'history';        // HTML5

var history = createHistory({
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
var unlisten = history.listen(function (location) {
  location.key;       // A unique key for this location
  location.state;     // The state that was given to push/replaceState
  location.pathname;  // The URL pathname, without the query string
  location.search;    // The URL query string, including the ?
  location.action;    // One of PUSH, REPLACE, or POP
});

history.pushState(state, url);
history.replaceState(state, url);
history.go(-1);
history.goBack();
history.goForward();

// Stop listening for location changes.
unlisten();
```
