import describeHistory from './describeHistory';

function describeDOMHistory(createHistory) {
  beforeEach(function () {
    window.location.href = '/';
  });

  describeHistory(createHistory);
}

export default describeDOMHistory;
