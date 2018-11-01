const invokeProcess = require( './invoke_process' );

module.exports = async ( path, emitter, opts ) =>
  invokeProcess( 'block', path, emitter, opts );
