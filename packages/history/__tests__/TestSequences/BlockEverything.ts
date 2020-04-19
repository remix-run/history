import expect from 'expect';
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

      let unblock = history.block(()=>{});

      history.push('/home');

      expect(history.location).toMatchObject({
        pathname: '/',
      });

      unblock();
    },
  ];

  execSteps(steps, history, done);
};
