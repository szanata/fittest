module.exports = ( phase, args, timeoutTime ) => new Promise( async ( resolve, reject ) => {
  const timeoutMonitor = setTimeout( async () => {
    reject( new Error( 'TIMEOUT' ) );
  }, timeoutTime );

  try {
    // @TODO dont return anything after deprecating the 'createContext' and 'rollback' methods
    const r = await phase( ...args );
    resolve( r );
  } catch ( err ) {
    reject( err );
  }
  clearTimeout( timeoutMonitor );
} );
