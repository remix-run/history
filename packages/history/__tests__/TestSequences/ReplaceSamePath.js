import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
  let prevLocation;

  let steps = [
    ({ index, location }) => {
      expect(index).toBe(0);
      expect(location).toMatchObject({
        pathname: "/",
      });

      history.replace("/home");
    },
    ({ index, action, location }) => {
      expect(index).toBe(0);
      expect(action).toBe("REPLACE");
      expect(location).toMatchObject({
        pathname: "/home",
      });

      prevLocation = location;

      history.replace("/home");
    },
    ({ index, action, location }) => {
      expect(index).toBe(0);
      expect(action).toBe("REPLACE");
      expect(location).toMatchObject({
        pathname: "/home",
      });

      expect(location).not.toBe(prevLocation);
    },
  ];

  execSteps(steps, history, done);
};
