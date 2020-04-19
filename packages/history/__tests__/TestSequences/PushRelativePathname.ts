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

      history.push('/the/path?the=query#the-hash');
    },
    ({ action, location }) => {
      expect(action).toBe(Action.Push);
      expect(location).toMatchObject({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash',
      });

      history.push('../other/path?another=query#another-hash');
    },
    ({ action, location }) => {
      expect(action).toBe(Action.Push);
      expect(location).toMatchObject({
        pathname: '/other/path',
        search: '?another=query',
        hash: '#another-hash',
      });
    },
  ];

  execSteps(steps, history, done);
};
