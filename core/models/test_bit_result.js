module.exports = {
  init( ) {
    return {
      get ok() {
        return !this.err;
      },
      et: 0,
      err: null,
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
