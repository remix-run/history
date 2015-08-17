## Histories

A "history" is an object analogous to a web browser's [History](https://developer.mozilla.org/en-US/docs/Web/API/History) that acts like an event emitter for the current [`location`](../Location.md) object.

`history` ships with several different implementations depending on your environment.

- [Browser History](BrowserHistory.md) is for modern web browser environments that support the HTML5 history API
- [Hash History](HashHistory.md) is for legacy web browsers (<= IE 9)
- [Memory History](MemoryHistory.md) is for unit testing
