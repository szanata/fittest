const TestEnv = require( '../models/test_env' );

module.exports = ( fwEnv, id, emitter ) =>
  TestEnv.init( `${fwEnv.features.serverUrl}/${id}`, emitter.once );
