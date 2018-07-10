const fiveMinutes = 300000;
const executePhase = require( './execute_phase' );

const methods = [ 'before', 'createContext', 'exec', 'rollback', 'after' ];

module.exports = async ( name, test, env, logger, cfg, ) => {
  const ctx = {};
  const args = [ env, ctx, logger ];
  const timeoutTime = parseInt( cfg.timeoutTime, 10 ) || fiveMinutes;

  let success = true;

  if ( !test.exec ) {
    return true;
  }

  /* eslint-disable no-await-in-loop, no-continue */
  for ( const method of methods ) {
    if ( !test[method] ) { continue; }

    try {
      // @TODO dont sotre the result after deprecating the 'createContext' and 'rollback' methods
      const r = await executePhase( test[method], args, timeoutTime );
      // @TODO remove this after deprecating the 'createContext' and 'rollback' methods
      if ( method === 'createContext' && typeof r === 'object' ) {
        Object.assign( ctx, r );
      }
    } catch ( err ) {
      logger.error( err.message === 'TIMEOUT' ? `${name} ".${method}()" timed out.` : err.message );

      // errors on the "before" phase break everything without rollback.
      if ( method === 'before' || method === 'createContext' ) {
        return false;
      }
      success = false;
    }
  }

  return success;
};
