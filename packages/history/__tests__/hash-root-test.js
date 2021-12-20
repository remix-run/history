import { createHashHistory } from 'history';
import { testHashHistory } from './hash-test.js';

describe('a hash history with no slash', () => {
  testHashHistory('#', () => {
    return createHashHistory({hashRoot: ''});
  })  
});
