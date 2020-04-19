import expect from 'expect';
import { History } from 'history';
import { Done } from 'mocha';
import { execSteps } from './utils';
import type { ExecSteps } from './utils';

export default (history: History, done: Done) => {
  let steps: ExecSteps = [
    ({ location }) => {
      expect(location.key).toBeTruthy();
    },
  ];

  execSteps(steps, history, done);
};
