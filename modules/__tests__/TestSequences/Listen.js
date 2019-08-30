import expect from 'expect';
import mock from 'jest-mock';

export default function(history, done) {
  const spy = mock.fn();
  const unlisten = history.listen(spy);

  expect(spy).not.toHaveBeenCalled();

  unlisten();
  done();
}
