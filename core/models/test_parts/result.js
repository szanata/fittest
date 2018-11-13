const defaults = {
  et: 0,
  ok: true,
  err: null
};
module.exports = {
  init( { et, ok, err } = defaults ) {
    let okState = ok;
    return {
      get ok() {
        return okState && !this.err;
      },
      set ok( _ok ) {
        okState = _ok;
      },
      et,
      err,
      serialize() {
        return {
          ok: this.ok,
          et: this.et,
          err: this.err ? {
            name: this.err.name,
            stack: this.err.stack,
            message: this.err.message
          } : null
        };
      }
    };
  }
};
