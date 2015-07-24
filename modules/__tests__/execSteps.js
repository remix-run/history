function execSteps(steps, done) {
  return function () {
    try {
      steps.shift().apply(this, arguments);

      if (steps.length === 0)
        done();
    } catch (error) {
      done(error);
    }
  };
}

export default execSteps;
