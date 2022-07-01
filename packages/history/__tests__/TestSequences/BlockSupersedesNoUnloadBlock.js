import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: "/",
      });

      let unblock = history.block();
      let noUnloadUnblock = history.noUnloadBlock();

      history.push("/home");

      expect(history.location).toMatchObject({
        pathname: "/",
      });

      unblock();
      noUnloadUnblock();
    },
  ];

  execSteps(steps, history, done);
};
