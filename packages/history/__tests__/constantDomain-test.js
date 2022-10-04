import expect from "expect";
import { createConstantDomainHistory } from "history";

import PushNewLocation from "./TestSequences/PushNewLocation.js";
import PushSamePath from "./TestSequences/PushSamePath.js";
import PushState from "./TestSequences/PushState.js";
import PushMissingPathname from "./TestSequences/PushMissingPathname.js";
import PushRelativePathname from "./TestSequences/PushRelativePathname.js";
import ReplaceNewLocation from "./TestSequences/ReplaceNewLocation.js";
import ReplaceSamePath from "./TestSequences/ReplaceSamePath.js";
import ReplaceState from "./TestSequences/ReplaceState.js";
import EncodedReservedCharacters from "./TestSequences/EncodedReservedCharacters.js";
import GoBack from "./TestSequences/GoBack.js";
import BlockEverything from "./TestSequences/BlockEverything.js";
import { execSteps } from "./TestSequences/utils.js";

describe("a constant domain history", () => {
  let history;
  beforeEach(() => {
    window.history.replaceState(null, null, "/");
    history = createConstantDomainHistory();
  });

  describe("push a new path", () => {
    it("calls change listeners with the new location", (done) => {
      PushNewLocation(history, done);
    });
  });

  describe("push the same path", () => {
    it("calls change listeners with the new location", (done) => {
      PushSamePath(history, done);
    });
  });

  describe("push state", () => {
    it("calls change listeners with the new location", (done) => {
      PushState(history, done);
    });
  });

  describe("push with no pathname", () => {
    it("reuses the current location pathname", (done) => {
      PushMissingPathname(history, done);
    });
  });

  describe("push with a relative pathname", () => {
    it("normalizes the pathname relative to the current location", (done) => {
      PushRelativePathname(history, done);
    });
  });

  describe("replace a new path", () => {
    it("calls change listeners with the new location", (done) => {
      ReplaceNewLocation(history, done);
    });
  });

  describe("replace the same path", () => {
    it("calls change listeners with the new location", (done) => {
      ReplaceSamePath(history, done);
    });
  });

  describe("replace state", () => {
    it("calls change listeners with the new location", (done) => {
      ReplaceState(history, done);
    });
  });

  describe("location created with encoded/unencoded reserved characters", () => {
    it("produces different location objects", (done) => {
      EncodedReservedCharacters(history, done);
    });
  });

  describe("back", () => {
    it("calls change listeners with the previous location", (done) => {
      GoBack(history, done);
    });
    it("avoid going back to a different domain (on initial route)", (done) => {
      let steps = [
        ({ action, location }) => {
          expect(location).toMatchObject({
            pathname: "/",
          });

          const blocked = history.back();
          expect(blocked).toBeTruthy();
        },
      ];
      execSteps(steps, history, done);
    });
    it("avoid going back to a different domain, after replace", (done) => {
      let steps = [
        ({ location }) => {
          expect(location).toMatchObject({
            pathname: "/",
          });
          history.replace("/home?the=query#the-hash", { the: "state" });
        },
        ({ action, location }) => {
          expect(action).toBe("REPLACE");
          expect(location).toMatchObject({
            pathname: "/home",
            search: "?the=query",
            hash: "#the-hash",
            state: { the: "state" },
            key: expect.any(String),
          });

          const blocked = history.back();
          expect(blocked).toBeTruthy();
        },
      ];
      execSteps(steps, history, done);
    });
    it("avoid going back to a different domain, starting from a different domain", (done) => {
      // TODO: how to test?
      done();
    });
    it("go back after a reload", (done) => {
      // TODO: how to test?
      done();
    });
  });

  describe("forward", () => {
    it("forward is not allowed in constant domain history", (done) => {
      let steps = [
        ({ location }) => {
          expect(location).toMatchObject({
            pathname: "/",
          });

          history.push("/home");
        },
        ({ action, location }) => {
          expect(action).toEqual("PUSH");
          expect(location).toMatchObject({
            pathname: "/home",
          });

          const blocked = history.back();
          expect(blocked).toBeFalsy();
        },
        ({ action, location }) => {
          expect(action).toEqual("POP");
          expect(location).toMatchObject({
            pathname: "/",
          });

          const blocked = history.forward();
          expect(blocked).toBeTruthy();
          expect(history.location).toMatchObject({
            pathname: "/",
          });
        },
      ];

      execSteps(steps, history, done);
    });
  });

  describe("block", () => {
    it("blocks all transitions", (done) => {
      BlockEverything(history, done);
    });
  });

  // describe("block a POP without listening", () => {
  //   it("receives the next ({ action, location })", (done) => {
  //     BlockPopWithoutListening(history, done);
  //   });
  // });
});
