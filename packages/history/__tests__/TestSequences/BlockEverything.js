import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
  let steps = [
    ({ index, location }) => {
      expect(index).toBe(0);
      expect(location).toMatchObject({
        pathname: "/",
      });

      let unblock = history.block();

      history.push("/home");

      expect(history.index).toBe(0);
      expect(history.location).toMatchObject({
        pathname: "/",
      });

      unblock();
    },
  ];

  execSteps(steps, history, done);
};
