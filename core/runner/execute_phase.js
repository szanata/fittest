const TimeoutError = require( './timeout_error' );

module.exports = ( phase, args, timeoutTime ) => new Promise( async ( resolve, reject ) => {
  const timeoutMonitor = setTimeout( () => reject( new TimeoutError() ), timeoutTime );

  try {
    await phase( ...args );
    resolve( );
  } catch ( err ) {
    reject( err );
  }
  clearTimeout( timeoutMonitor );
} );
