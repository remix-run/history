import expect from 'expect';
import { testHashHistory } from './hash-test.js';

describe('a hash history with no slash', () => {
  testHashHistory('#', {hashRoot: ""})
});
