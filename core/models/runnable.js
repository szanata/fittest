const Result = require( './result' );

module.exports = {
  init( fn ) {
    return {
      fn,
      output: [],
      result: Result.init(),
      serialize() {
        return {
          output: this.output,
          result: this.result.serialize()
        };
      }
    };
  }
};
