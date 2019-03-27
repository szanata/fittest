const localtunnel = require( 'localtunnel' );

module.exports = port => new Promise( ( resolve, reject ) => {
  localtunnel( port, ( err, tunnel ) => {
    if ( err ) {
      reject( err );
    } else {
      resolve( tunnel.url );
    }
  } );
} );
