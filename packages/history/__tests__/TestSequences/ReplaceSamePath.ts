import expect from 'expect';
import { History, Action, Location } from 'history';
import { Done } from 'mocha';

import { execSteps } from './utils';
import type { ExecSteps } from './utils';

export default (history: History, done: Done) => {
  let prevLocation: Location;

  let steps: ExecSteps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/',
      });

      history.replace('/home');
    },
    ({ action, location }) => {
      expect(action).toBe(Action.Replace);
      expect(location).toMatchObject({
        pathname: '/home',
      });

      prevLocation = location;

      history.replace('/home');
    },
    ({ action, location }) => {
      expect(action).toBe(Action.Replace);
      expect(location).toMatchObject({
        pathname: '/home',
      });

      expect(location).not.toBe(prevLocation);
    },
  ];

  execSteps(steps, history, done);
};
