import expect from "expect";
import { hasBasename, stripBasename } from "../PathUtils";

describe("hasBasename", () => {
  describe("with a simple path", () => {
    const basepath = '/prefix/with'
    describe("given as a url with basename", () => {
      it("returns true", () => {
        expect(hasBasename(`${basepath}/some/url/path`, basepath)).toBeTruthy();
      });
    });

    describe("given as a url without basename", () => {
      it("returns false", () => {
        expect(hasBasename(`/some/url/path`, basepath)).toBeFalsy();
      });
    });
  });

  describe("with a hash value", () => {
    const basepath = '/prefix/with#/'
    describe("given as a url with basename", () => {
      it("returns true", () => {
        expect(hasBasename(`${basepath}/some/url/path`, basepath)).toBeTruthy();
      });
    });

    describe("given as a url without basename", () => {
      it("returns false", () => {
        expect(hasBasename(`/some/url/path`, basepath)).toBeFalsy();
      });
    });
  });

  describe("with a search value", () => {
    const basepath = '/prefix/with?search'
    describe("given as a url with basename", () => {
      it("returns true", () => {
        expect(hasBasename(`${basepath}/some/url/path`, basepath)).toBeTruthy();
      });
    });

    describe("given as a url without basename", () => {
      it("returns false", () => {
        expect(hasBasename(`/some/url/path`, basepath)).toBeFalsy();
      });
    });
  });
});

describe("stripBasename", () => {
  describe("with a simple path", () => {
    const basepath = '/prefix/with'
    describe("given as a url with basename", () => {
      it("returns true", () => {
        expect(stripBasename(`${basepath}/some/url/path`, '/some/url/path')).toBeTruthy();
      });
    });
  });

  describe("with a hash value", () => {
    const basepath = '/prefix/with#/'
    describe("given as a url with basename", () => {
      it("returns true", () => {
        expect(stripBasename(`${basepath}/some/url/path`, '/some/url/path')).toBeTruthy();
      });
    });
  });

  describe("with a search value", () => {
    const basepath = '/prefix/with?search'
    describe("given as a url with basename", () => {
      it("returns true", () => {
        expect(stripBasename(`${basepath}/some/url/path`, '/some/url/path')).toBeTruthy();
      });
    });
  });
});
