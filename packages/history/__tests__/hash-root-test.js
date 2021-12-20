import expect from 'expect';
import { createHashHistory, createPath } from 'history';
import { testHashHistory } from './hash-test.js';

describe('a hash history with no slash', () => {
  testHashHistory('#', () => {
    const history = createHashHistory({hashRoot: ''});

    // Test window location at every step
    return new Proxy(history, {
      get(target, prop, _) {
        if (prop === 'location') {
          const historyHref = createPath(history.location)
          const windowHref = window.location.hash.substr(1)
          expect(historyHref.replace('/','')).toEqual(windowHref);
          expect(historyHref).toEqual(windowHref.replace('', '/'));
        }
        return Reflect.get(target, prop, _);
      }
    });
  })  
});
