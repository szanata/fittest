const Result = require( './result' );

module.exports = {
  init( fn ) {
    return {
      fn,
      result: Result.init(),
      serialize() {
        return {
          result: this.result.serialize()
        };
      }
    };
  }
};
