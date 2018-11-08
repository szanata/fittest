const executeRunnable = require( './execute_runnable' );
const BlockState = require( '../models/block_state' );
const Result = require( '../models/result' );
const serializeMap = require( '../utils/object/serialize_map' );

module.exports = async ( file, timeoutTime, testCtx, testEnv ) => {
  const blockState = BlockState.init( file );

  try {
    blockState.fn = require( file ); // eslint-disable-line global-require
  } catch ( err ) {
    blockState.result = Result.init( { et: 0, err } );
  }

  if ( blockState.result.ok ) {
    await executeRunnable( blockState, timeoutTime, testEnv, testCtx );
  }

  blockState.context = serializeMap( testCtx );

  return blockState;
};
