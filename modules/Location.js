import NavigationTypes from './NavigationTypes';

/**
 * A Location answers two important questions:
 *
 * 1. Where am I?
 * 2. How did I get here?
 */
class Location {

  static isLocation(object) {
    return object instanceof Location;
  }

  constructor(pathname='/', search='', state=null, navigationType=NavigationTypes.POP) {
    this.pathname = pathname;
    this.search = search;
    this.state = state;
    this.navigationType = navigationType;
  }

}

export default Location;
