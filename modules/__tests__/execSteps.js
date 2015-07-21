function execSteps(steps, done) {
  return function () {
    try {
      steps.shift().apply(this, arguments);
    } catch (error) {
      done(error);
    }
  };
}

export default execSteps;
