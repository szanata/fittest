const TestBitResult = require( '../models/test_bit_result' );
const Timer = require( '../utils/time/timer' );

module.exports = async ( bit, ...args ) => {
  const t = Timer.init();
  const result = TestBitResult.init();
  try {
    await bit.fn( ...args );
  } catch ( err ) {
    result.err = err;
  }
  result.et = t.stop();
  bit.result = result;

  return bit.ok;
};
