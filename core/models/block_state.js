const TestBitResult = require( './test_bit_result' );

module.exports = {
  init( fn ) {
    return {
      fn,
      logs: [],
      return: TestBitResult.init(),
      get ok() {
        return this.result.ok;
      },
      serialize( ) {
        return {
          result: this.result.serialize()
        };
      }
    };
  }
};
