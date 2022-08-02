import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
  let steps = [
    ({ index, location }) => {
      expect(index).toBe(0);
      expect(location).toMatchObject({
        pathname: "/",
      });

      history.push("/home?the=query#the-hash", { the: "state" });
    },
    ({ index, action, location }) => {
      expect(index).toBe(1);
      expect(action).toBe("PUSH");
      expect(location).toMatchObject({
        pathname: "/home",
        search: "?the=query",
        hash: "#the-hash",
        state: { the: "state" },
      });
    },
  ];

  execSteps(steps, history, done);
};
