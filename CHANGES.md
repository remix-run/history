## HEAD

- Fail gracefully when Safari security settings prevent access to window.sessionStorage
- Pushing the currently active path will result in a replace to not create additional browser history entries (see [#43])
- Strip the protocol and domain from `<base href>` (see [#139])

[#43]: https://github.com/rackt/history/pull/43
[#139]: https://github.com/rackt/history/pull/139 

## [v1.13.0]
> Oct 28, 2015

- `useBasename` transparently handles trailing slashes (see [#108])
- `useBasename` automatically uses the value of `<base href>` when no
  `basename` option is provided (see [#94])

[v1.13.0]: https://github.com/rackt/history/compare/v1.12.6...v1.13.0
[#108]: https://github.com/rackt/history/pull/108
[#94]: https://github.com/rackt/history/issues/94

## [v1.12.6]
> Oct 25, 2015

- Add `forceRefresh` option to `createBrowserHistory` that forces
  full page refreshes even when the browser supports pushState (see [#95])

[v1.12.6]: https://github.com/rackt/history/compare/v1.12.5...v1.12.6
[#95]: https://github.com/rackt/history/issues/95

## [v1.12.5]
> Oct 11, 2015

- Un-deprecate top-level createLocation method
- Add ability to use `{ pathname, search, hash }` object anywhere
  a path can be used
- Fix `useQueries` handling of hashes (see [#93])

[v1.12.5]: https://github.com/rackt/history/compare/v1.12.4...v1.12.5
[#93]: https://github.com/rackt/history/issues/93

## [v1.12.4]
> Oct 9, 2015

- Fix npm postinstall hook on Windows (see [#62])

[v1.12.4]: https://github.com/rackt/history/compare/v1.12.3...v1.12.4
[#62]: https://github.com/rackt/history/issues/62

## [v1.12.3]
> Oct 7, 2015

- Fix listenBefore hooks not being called unless a listen hook was also registered (see [#71])
- Add a warning when we cannot save state in Safari private mode (see [#42])

[v1.12.3]: https://github.com/rackt/history/compare/v1.12.2...v1.12.3
[#71]: https://github.com/rackt/history/issues/71
[#42]: https://github.com/rackt/history/issues/42

## [v1.12.2]
> Oct 6, 2015

- Fix hash support (see [comments in #51][#51-comments])

[v1.12.2]: https://github.com/rackt/history/compare/v1.12.1...v1.12.2
[#51-comments]: https://github.com/rackt/history/pull/51#issuecomment-143189672

## [v1.12.1]
> Oct 5, 2015

- Give `location` objects a `key` by default
- Deprecate `history.setState`

[v1.12.1]: https://github.com/rackt/history/compare/v1.12.0...v1.12.1

## [v1.12.0]
> Oct 4, 2015

- Add `history.createLocation` instance method. This allows history enhancers such as `useQueries` to modify `location` objects when creating them directly
- Deprecate `createLocation` method on top-level exports

[v1.12.0]: https://github.com/rackt/history/compare/v1.11.1...v1.12.0

## [v1.11.1]
> Sep 26, 2015

- Fix `location.basename` when location matches exactly (see #68)
- Allow transitions to be interrupted by another

[v1.11.1]: https://github.com/rackt/history/compare/v1.11.0...v1.11.1

## [v1.11.0]
> Sep 24, 2015

- Add `useBasename` history enhancer
- Add `history.listenBefore`
- Add `history.listenBeforeUnload` to `useBeforeUnload` history enhancer
- Deprecate (un)registerTransitionHook
- Deprecate (un)registerBeforeUnloadHook
- Fix installing directly from git repo

[v1.11.0]: https://github.com/rackt/history/compare/v1.10.2...v1.11.0
