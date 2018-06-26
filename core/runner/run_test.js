const fiveMinutes = 300000;

const runPhase = ( name, test, method, args, logger, timeoutTime ) => new Promise( async resolve => {
  const timeoutMonitor = setTimeout( async () => {
    logger.error( `${name} ".${method}()" timed out.` );
    resolve( false );
  }, timeoutTime );

  try {
    await test[method]( ...args );
    resolve( true );
  } catch ( err ) {
    logger.error( err.message, err.stack );
    resolve( false );
  }
  clearTimeout( timeoutMonitor );
} );

module.exports = async ( name, test, env, logger, cfg, methods = [ 'exec', 'rollback' ] ) => {
  const ctx = test.createContext ? test.createContext() : {};
  const args = [ env, ctx, logger ];
  const timeoutTime = parseInt( cfg.timeoutTime, 10 ) || fiveMinutes;

  let pass = true;

  /* eslint-disable no-await-in-loop */
  for ( const method of methods ) {
    if ( !test[method] ) { return pass; }
    pass = await runPhase( name, test, method, args, logger, timeoutTime );
  }

  return pass;
};
