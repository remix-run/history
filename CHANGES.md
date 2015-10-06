## HEAD

- Fix hash support (see [comments in #51][#51-comments])

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
