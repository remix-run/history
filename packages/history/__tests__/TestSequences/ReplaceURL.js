import expect from "expect";

import { execSteps } from "./utils.js";

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: "/",
      });

      const nextURL = new URL("/home?the=query#the-hash", new URL('https://example.com'));
      history.replace(nextURL);
    },
    ({ action, location }) => {
      expect(action).toBe("REPLACE");
      expect(location).toMatchObject({
        pathname: "/home",
        search: "?the=query",
        hash: "#the-hash",
      });
    },
  ];

  execSteps(steps, history, done);
};
