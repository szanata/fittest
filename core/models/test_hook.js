const TestBitResult = require( './test_bit_result' );

module.exports = {
  init( type, fn ) {
    return {
      type,
      fn,
      result: TestBitResult.init(),
      get ok() {
        return this.result.ok;
      },
      serialize() {
        return {
          type: this.type,
          result: this.result.serialize()
        };
      }
    };
  }
};
