const Result = require( './result' );

module.exports = {
  init( fn ) {
    return {
      fn,
      outputs: [],
      result: Result.init(),
      invoked: false,
      serialize() {
        return {
          outputs: this.outputs,
          result: this.result.serialize(),
          invoked: this.invoked
        };
      }
    };
  }
};
