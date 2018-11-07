module.exports = {
  init( et = 0, err = null ) {
    return {
      get ok() {
        return !this.err;
      },
      et,
      err,
      serialize() {
        return {
          ok: this.ok,
          err: !this.ok ? {
            name: this.err.name,
            stack: this.err.stack,
            message: this.err.message
          } : null
        };
      }
    };
  }
};
