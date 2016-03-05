/* eslint-disable no-alert */
export const addEventListener = (node, event, listener) =>
  node.addEventListener
    ? node.addEventListener(event, listener, false)
    : node.attachEvent(`on${event}`, listener)

export const removeEventListener = (node, event, listener) =>
  node.removeEventListener
    ? node.removeEventListener(event, listener, false)
    : node.detachEvent(`on${event}`, listener)

// We can't use window.location.hash here because it's not
// consistent across browsers - Firefox will pre-decode it!
export const getHashPath = () =>
  window.location.href.split('#')[1] || ''

export const replaceHashPath = (path) =>
  window.location.replace(
    `${window.location.pathname}${window.location.search}#${path}`
  )

export const getWindowPath = () =>
  window.location.pathname + window.location.search + window.location.hash

export const go = (n) =>
  n && window.history.go(n)

export const getUserConfirmation = (message, callback) =>
  callback(window.confirm(message))

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/rackt/react-router/issues/586
 */
export const supportsHistory = () => {
  const ua = navigator.userAgent

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  )
    return false

  return window.history && 'pushState' in window.history
}

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
export const supportsGoWithoutReloadUsingHash = () =>
  navigator.userAgent.indexOf('Firefox') === -1
