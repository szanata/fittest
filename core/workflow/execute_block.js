const invokeRunner = require( './invoke_runner' );
const { RunnableTypes } = require( '../models/types' );

module.exports = async ( fwResult, blockType, emitter, fwEnv ) => {
  if ( fwEnv.blockPaths[blockType] ) {
    const blockState = await invokeRunner( emitter, {
      type: RunnableTypes.block,
      filePath: fwEnv.blockPaths[blockType],
      fwEnv
    } );

    emitter.emit( 'task_done' );

    // overwrite context with the context of the block
    fwEnv.context = blockState.context;
    fwResult.states[blockType] = blockState;
  }
};
