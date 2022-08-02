import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
  let hookWasCalled = false;
  let unblock;

  let steps = [
    ({ index, location }) => {
      expect(index).toBe(0);
      expect(location).toMatchObject({
        pathname: "/",
      });

      history.push("/home");
    },
    ({ index, action, location }) => {
      expect(index).toBe(1);
      expect(action).toBe("PUSH");
      expect(location).toMatchObject({
        pathname: "/home",
      });

      unblock = history.block(() => {
        hookWasCalled = true;
      });

      window.history.go(-1);
    },
    ({ index, action, location }) => {
      expect(index).toBe(0);
      expect(action).toBe("POP");
      expect(location).toMatchObject({
        pathname: "/",
      });

      expect(hookWasCalled).toBe(true);

      unblock();
    },
  ];

  execSteps(steps, history, done);
};
