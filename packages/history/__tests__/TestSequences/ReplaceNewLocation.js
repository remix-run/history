import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
  let steps = [
    ({ index, location }) => {
      expect(index).toBe(0);
      expect(location).toMatchObject({
        pathname: "/",
      });

      history.replace("/home?the=query#the-hash");
    },
    ({ index, action, location }) => {
      expect(index).toBe(0);
      expect(action).toBe("REPLACE");
      expect(location).toMatchObject({
        pathname: "/home",
        search: "?the=query",
        hash: "#the-hash",
        state: null,
        key: expect.any(String),
      });

      history.replace("/");
    },
    ({ index, action, location }) => {
      expect(index).toBe(0);
      expect(action).toBe("REPLACE");
      expect(location).toMatchObject({
        pathname: "/",
        search: "",
        state: null,
        key: expect.any(String),
      });
    },
  ];

  execSteps(steps, history, done);
};
