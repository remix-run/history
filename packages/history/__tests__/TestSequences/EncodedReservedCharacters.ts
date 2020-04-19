import expect from 'expect';
import type { History } from 'history';
import type { Done } from 'mocha';

import { execSteps } from './utils';
import type { ExecSteps } from './utils';

export default (history: History, done: Done) => {
  let steps: ExecSteps = [
    () => {
      // encoded string
      let pathname = '/view/%23abc';
      history.replace(pathname);
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/%23abc',
      });
      // encoded object
      let pathname = '/view/%23abc';
      history.replace({ pathname });
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/%23abc',
      });
      // unencoded string
      let pathname = '/view/#abc';
      history.replace(pathname);
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/',
        hash: '#abc',
      });
    },
  ];

  execSteps(steps, history, done);
};
