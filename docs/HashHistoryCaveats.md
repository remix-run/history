## Caveats of Using Hash History

Using `window.location.hash` is a common trick that is used to mimic the HTML5 history API in older browsers. It works for most use cases and provides good compatibility across a wide range of browsers. However, in order to preserve state across browser sessions we need a place to store some state.

HTML5 gives us the `pushState` method and the `popstate` event, but in older browsers the only thing we have is the URL. So, when using hash history, you'll see an extra item in your query string that looks something like `_k=123abc`. This is a key that `history` uses to look up persistent state data in `window.sessionStorage` between page loads. If you prefer to use a different query parameter, or to opt-out of this behavior entirely, use the `queryKey` configuration option.

```js
import createHistory from 'history/lib/createHashHistory'

// Use _key instead of _k.
let history = createHistory({
  queryKey: '_key'
})

// Opt-out of persistent state, not recommended.
let history = createHistory({
  queryKey: false
})
```

One other thing to keep in mind when using hash history is that you cannot also use `window.location.hash` as it was originally intended, to link an anchor point within your HTML document.
