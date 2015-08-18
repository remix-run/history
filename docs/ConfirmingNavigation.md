## Confirming Navigation

Sometimes you may want to prevent the user from going to a different page. For example, if they are halfway finished filling out a long form, and they click the back button (or try to close the tab), you may want to prompt them to confirm they actually want to leave the page before they lose the information they've already entered. For these cases, `history` lets you register transition hooks that return a prompt message you can show the user before the location changes. For example, you could do something like this:

```js
history.registerTransitionHook(function () {
  if (input.value !== '')
    return 'Are you sure you want to leave this page?';
});
```

You can also simply `return false` to prevent a transition.

In browsers, `history` uses [`window.confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) by default to display confirmation messages to users. However, you can provide your own custom confirmation dialog box using the `getUserConfirmation` hook when you create your `history` object.

```js
var history = createHistory({
  getUserConfirmation: function (message, callback) {
    callback(window.confirm(message)); // The default behavior
  }
});
```
