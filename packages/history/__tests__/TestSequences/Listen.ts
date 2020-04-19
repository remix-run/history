import expect from 'expect';
import mock from 'jest-mock';
import { Done } from 'mocha';
import { History } from 'history';

export default (history: History, done: Done) => {
  let spy = mock.fn();
  let unlisten = history.listen(spy);

  expect(spy).not.toHaveBeenCalled();

  unlisten();
  done();
};
