const invokeRunner = require( './invoke_runner' );
const { RunnableTypes } = require( '../models/types' );

module.exports = async ( fwResult, blockType, emitter, fwEnv ) => {
  if ( fwEnv.blockPaths[blockType] ) {
    fwResult.state[blockType] = await invokeRunner( emitter, {
      type: RunnableTypes.block,
      filePath: fwEnv.blockPaths[blockType],
      fwEnv
    } );
  }
};
