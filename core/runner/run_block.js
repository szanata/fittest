const TimeoutKiller = require( '../utils/time/timeout_killer' );
const BlockState = require( '../model/block_state' );
const executeTestBit = require( './execute_test_bit' );
const TestBitResult = require( '../models/test_bit_result' );

module.exports = async ( file, fwEnv, testCtx, testEnv ) => {
  const blockState = BlockState.init( file );

  TimeoutKiller.init( fwEnv.timeoutTime );

  try {
    blockState.fn = require( file ); // eslint-disable-line global-require
  } catch ( err ) {
    blockState.result = TestBitResult.init( 0, err );
  }

  if ( blockState.ok ) {
    await executeTestBit( blockState, testEnv, testCtx );
  }

  TimeoutKiller.stop();
  return blockState;
};
