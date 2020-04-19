import mock from 'jest-mock';
import type { History } from 'history';
import type { Done } from 'mocha';
import type { Update } from 'history';

export function spyOn<T extends object, key extends keyof T>(
  object: T,
  method: key
) {
  let original = object[method];
  let spy = mock.fn();

  object[method] = spy as any;

  return {
    spy,
    destroy() {
      object[method] = original;
    },
  };
}
export type ExecSteps = ReadonlyArray<(update: Update) => void>;

export function execSteps(steps: ExecSteps, history: History, done: Done) {
  let index = 0,
    unlisten: () => void,
    cleanedUp = false;

  function cleanup(update?: Update) {
    if (!cleanedUp) {
      cleanedUp = true;
      unlisten();
      done(update);
    }
  }

  function execNextStep(update: Update) {
    try {
      let nextStep = steps[index++];
      if (!nextStep) throw new Error('Test is missing step ' + index);

      nextStep(update);

      if (index === steps.length) cleanup();
    } catch (error) {
      cleanup(error);
    }
  }

  if (steps.length) {
    unlisten = history.listen(execNextStep);

    execNextStep({
      action: history.action,
      location: history.location,
    });
  } else {
    done();
  }
}
