module.exports = {
  init( { name, pass, elapsedTime = 0, logs = [], context = {} } ) {
    return {
      name,
      pass,
      elapsedTime,
      logs,
      context
    };
  }
};
