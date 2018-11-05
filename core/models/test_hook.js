module.exports = {
  init( type, fn ) {
    return {
      type,
      fn,
      result: {},
      get ok() {
        return this.result.ok;
      }
    };
  }
};
