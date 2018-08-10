module.exports = ( phase, args, timeoutTime ) => new Promise( async ( resolve, reject ) => {
  const timeoutMonitor = setTimeout( () => {
    reject( new Error( 'TIMEOUT' ) );
  }, timeoutTime );

  try {
    await phase( ...args );
    resolve( );
  } catch ( err ) {
    reject( err );
  }
  clearTimeout( timeoutMonitor );
} );
