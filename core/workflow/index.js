const FwResult = require( './models/fw_result' );
const executeTests = require( './execute_tests' );
const Timer = require( '../utils/timer/timer' );
const executeBlock = require( './execute_block' );
const { BlockTypes: { beforeAll, afterAll } } = require( '../models/types' );

module.exports = {
  async execute( emitter, fwEnv ) {
    const fwResult = FwResult.init();
    const timer = Timer.start();

    await executeBlock( fwResult, beforeAll, emitter, fwEnv );

    if ( fwResult.ok ) {
      await executeTests( fwResult, emitter, fwEnv );
      await executeBlock( fwResult, afterAll, emitter, fwEnv );
    }

    fwResult.et = timer.stop();
    return fwResult;
  }
};
