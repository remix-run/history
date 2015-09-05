## Confirming Navigation

Sometimes you may want to prevent the user from going to a different page. For example, if they are halfway finished filling out a long form, and they click the back button, you may want to prompt them to confirm they actually want to leave the page before they lose the information they've already entered. For these cases, `history` lets you register [transition hooks](Terms.md#transitionhook) that return a prompt message you can show the user before the [location](Terms.md#location) changes. For example, you could do something like this:

```js
history.registerTransitionHook(function (location) {
  if (input.value !== '')
    return 'Are you sure you want to leave this page?'
})
```

You can also simply `return false` to prevent a [transition](Terms.md#transition).

If your transition hook needs to execute asynchronously, you can provide a second `callback` argument to your transition hook function that you must call when you're done with async work.

```js
history.registerTransitionHook(function (location, callback) {
  doSomethingAsync().then(callback)
})
```

Note: **If you do provide a `callback` argument, the transition will not proceed until you call it (i.e. listeners will not be notified of the new `location`)! If your app is slow for some reason, this could lead to a non-responsive UI.**

In browsers, `history` uses [`window.confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) by default to display confirmation messages to users. However, you can provide your own custom confirmation dialog box using the `getUserConfirmation` hook when you create your `history` object.

```js
let history = createHistory({
  getUserConfirmation: function (message, callback) {
    callback(window.confirm(message)) // The default behavior
  }
})
```

### The `beforeunload` Event

If you need to prevent a browser window or tab from closing, `history` provides the `useBeforeUnload` enhancer function.

```js
import { createHistory, useBeforeUnload } from 'history'

let history = useBeforeUnload(createHistory)()

history.registerBeforeUnloadHook(function () {
  return 'Are you sure you want to leave this page?'
})
```

Note that because of the nature of the `beforeunload` event all hooks must `return` synchronously. `history` runs all hooks in the order they were registered and displays the first message that is returned.
