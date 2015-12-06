## Basename Support

Support for running an app under a "base" URL is provided by the `useBasename` [enhancer](Glossary.md#createhistoryenhancer) function. Simply use a wrapped version of your `createHistory` function to create your `history` object and you'll have the correct `location.pathname` inside `listen` and `listenBefore` hooks.

```js
import { createHistory, useBasename } from 'history'

// Run our app under the /base URL.
let history = useBasename(createHistory)({
  basename: '/base'
})

// At the /base/hello/world URL:
history.listen(function (location) {
  console.log(location.pathname) // /hello/world
  console.log(location.basename) // /base
})
```

Basename-enhanced histories also automatically prepend the basename to paths used in `push`, `replace`, `createPath`, and `createHref`.

```js
history.createPath('/the/path') // /base/the/path
history.push('/the/path') // push /base/the/path
```

### Using `<base href>`

In HTML documents, you can use the [`<base>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)'s `href` attribute to specify a `basename` for the page. This way, you don't have to manually pass the `basename` property to your `createHistory` function.
