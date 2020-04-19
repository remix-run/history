import expect from 'expect';
import { Action } from 'history';
import type { History } from 'history';
import type { Done } from 'mocha';

import { execSteps } from './utils';
import type { ExecSteps } from './utils';

export default (history: History, done: Done) => {
  let steps: ExecSteps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/',
      });

      history.push('/home');
    },
    ({ action, location }) => {
      expect(action).toBe(Action.Push);
      expect(location).toMatchObject({
        pathname: '/home',
      });

      history.push('/home');
    },
    ({ action, location }) => {
      expect(action).toBe(Action.Push);
      expect(location).toMatchObject({
        pathname: '/home',
      });

      history.back();
    },
    ({ action, location }) => {
      expect(action).toBe(Action.Pop);
      expect(location).toMatchObject({
        pathname: '/home',
      });
    },
  ];

  execSteps(steps, history, done);
};
