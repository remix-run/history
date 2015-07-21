function execSteps(steps, callback) {
  return function () {
    try {
      steps.shift().apply(this, arguments);

      if (steps.length === 0)
        callback();
    } catch (error) {
      callback(error);
    }
  };
}

export default execSteps;
