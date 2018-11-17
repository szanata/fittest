const { init: initFeatures } = require( './features' );
const { init: initEnvironment } = require( './environment' );
const { execute } = require( './workflow' );
const EventEmitter = require( 'events' );
const Printer = require( './printer' );
const getStackFrameDir = require( './utils/stack/get_stack_frame_dir' );
const pack = require( '../package.json' );

module.exports = {
  async run( params ) {
    try {
      Printer.header( pack );

      const relativeDir = getStackFrameDir( 3 );
      const emitter = new EventEmitter();
      const fwFeatures = await initFeatures( emitter );
      const fwEnv = initEnvironment( params, fwFeatures, relativeDir );

      Printer.setup( fwEnv );

      Printer.listenUpdates( emitter, fwEnv );

      const fwResult = await execute( emitter, fwEnv );

      Printer.result( fwResult );

      process.exit( fwResult.ok ? 0 : 1 );
    } catch ( err ) {
      console.error( err );
      process.exit( 1 );
    }
  }
};
