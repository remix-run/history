import expect from "expect";
import execSteps from "./execSteps";

export default function(history, done) {
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: "/"
      });

      history.link("/home");
    },
    (location, action) => {
      expect(action).toBe("PUSH");
      expect(location).toMatchObject({
        pathname: "/home"
      });

      history.link("/home");
    },
    (location, action) => {
      expect(action).toBe("REPLACE");
      expect(location).toMatchObject({
        pathname: "/home"
      });

      history.goBack();
    },
    (location, action) => {
      expect(action).toBe("POP");
      expect(location).toMatchObject({
        pathname: "/"
      });

      history.link("/home");
    },
    (location, action) => {
      expect(action).toBe("PUSH");
      expect(location).toMatchObject({
        pathname: "/home"
      });

      history.link("/home", {the: "state"});
    },
    (location, action) => {
      expect(action).toBe("REPLACE");
      expect(location).toMatchObject({
        pathname: "/home",
        state: {the: "state"}
      });

      history.goBack();
    },
    (location, action) => {
      expect(action).toBe("POP");
      expect(location).toMatchObject({
        pathname: "/"
      });
    }
  ];

  execSteps(steps, history, done);
}
