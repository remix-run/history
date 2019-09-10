# Blocking Transitions

`history` lets you register a prompt message that will be shown to the user before location listeners are notified. This allows you to make sure the user wants to leave the current page before they navigate away.

```js
// Register a simple prompt message that will be shown the
// user before they navigate away from the current page.
const unblock = history.block('Are you sure you want to leave this page?');

// Or use a function that returns the message when it's needed.
history.block((location, action) => {
  // The location and action arguments indicate the location
  // we're transitioning to and how we're getting there.

  // A common use case is to prevent the user from leaving the
  // page if there's a form they haven't submitted yet.
  if (input.value !== '') return 'Are you sure you want to leave this page?';
});

// To stop blocking transitions, call the function returned from block().
unblock();
```

**Note:** You'll need to provide a `getUserConfirmation` function to use this feature with `createMemoryHistory` (see below).

## Customizing the Confirm Dialog

By default, [`window.confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) is used to show prompt messages to the user. If you need to override this behavior (or if you're using `createMemoryHistory`, which doesn't assume a DOM environment), provide a `getUserConfirmation` function when you create your history object.

```js
const history = createHistory({
  getUserConfirmation(message, callback) {
    // Show some custom dialog to the user and call
    // callback(true) to continue the transiton, or
    // callback(false) to abort it.
  }
});
```
