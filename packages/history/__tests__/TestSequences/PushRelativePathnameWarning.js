import expect from "expect";

import { execSteps, spyOn } from "./utils.js";

export default (history, done) => {
  let steps = [
    ({ index, location }) => {
      expect(index).toBe(0);
      expect(location).toMatchObject({
        pathname: "/",
      });

      history.push("/the/path?the=query#the-hash");
    },
    ({ index, action, location }) => {
      expect(index).toBe(1);
      expect(action).toBe("PUSH");
      expect(location).toMatchObject({
        pathname: "/the/path",
        search: "?the=query",
        hash: "#the-hash",
      });

      let { spy, destroy } = spyOn(console, "warn");

      history.push("../other/path?another=query#another-hash");

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("relative pathnames are not supported")
      );

      destroy();
    },
    ({ index, location }) => {
      expect(index).toBe(2);
      expect(location).toMatchObject({
        pathname: "../other/path",
        search: "?another=query",
        hash: "#another-hash",
      });
    },
  ];

  execSteps(steps, history, done);
};
