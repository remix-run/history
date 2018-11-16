import mock from 'jest-mock';
import expect from 'expect';

export default function(history, done) {
  const spy = mock.fn();
  const unlisten = history.listen(spy);

  expect(spy).not.toHaveBeenCalled();

  unlisten();
  done();
}
