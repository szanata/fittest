const { init: initFeatures } = require( './features' );
const { init: initEnvironment } = require( './init_environment' );
const { execute } = require( './workflow' );
const EventEmitter = require( 'events' );
const Printer = require( './printer' );

module.exports = {
  async run( params ) {
    try {
      const emitter = new EventEmitter();
      const fwFeatures = await initFeatures( emitter );
      const fwEnv = initEnvironment( params, fwFeatures );
      const result = await execute( fwEnv );

      Printer.result( result );

      process.exit( result.ok ? 0 : 1 );
    } catch ( err ) {
      console.error( err );
      process.exit( 1 );
    }
  }
};
