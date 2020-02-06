import mock from 'jest-mock';

export default function spyOn(object, method) {
  let original = object[method];
  let spy = mock.fn();

  object[method] = spy;

  return {
    spy,
    destroy() {
      object[method] = original;
    }
  };
}
