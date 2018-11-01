module.exports = {
  start() {
    const t = Date.now();
    return {
      stop() {
        return Date.now() - t;
      }
    };
  }
};
