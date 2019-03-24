import expect from 'expect';

import execSteps from './execSteps';

export default function(history, done) {
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      const pathname = '/歴史';
      const search = '?キー=値';
      const hash = '#ハッシュ';
      history.push(pathname + search + hash);
    },
    (location, action) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/%E6%AD%B4%E5%8F%B2',
        search: '?キー=値',
        hash: '#ハッシュ'
      });
    }
  ];

  execSteps(steps, history, done);
}
