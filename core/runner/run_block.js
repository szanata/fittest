const executeRunnable = require( './execute_runnable' );
const Block = require( '../models/block' );
const Result = require( '../models/test_parts/result' );
const serializeMap = require( '../utils/object/serialize_map' );

module.exports = async ( file, timeoutTime, testCtx, testEnv ) => {
  const block = Block.init( file );

  try {
    block.fn = require( file ); // eslint-disable-line global-require
  } catch ( err ) {
    block.result = Result.init( { et: 0, err } );
  }

  if ( block.result.ok ) {
    await executeRunnable( block, timeoutTime, testEnv, testCtx );
  }

  block.context = serializeMap( testCtx );

  return block;
};
