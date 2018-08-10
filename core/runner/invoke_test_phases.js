const fiveMinutes = 300000;
const executePhase = require( './execute_phase' );

const methods = [ 'before', 'exec', 'after' ];

module.exports = async ( name, test, env, logger, cfg ) => {
  const ctx = {};
  const args = [ env, ctx, logger ];
  const timeoutTime = parseInt( cfg.timeoutTime, 10 ) || fiveMinutes;

  let success = true;

  /* eslint-disable no-await-in-loop*/
  for ( const method of methods.filter( m => test[m] ) ) {
    try {
      await executePhase( test[method], args, timeoutTime );
    } catch ( err ) {
      logger.error( `Error during ${method}:`, err.message );
      success = false;
      // errors on the "before" phase break everything without rollback.
      if ( method === 'before' ) { return success; }
    }
  }

  return success;
};
