import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
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
      expect(action).toEqual("PUSH");
      expect(location).toMatchObject({
        pathname: "/home",
      });

      history.back();
    },
    ({ index, action, location }) => {
      expect(index).toBe(0);
      expect(action).toEqual("POP");
      expect(location).toMatchObject({
        pathname: "/",
      });
    },
  ];

  execSteps(steps, history, done);
};
