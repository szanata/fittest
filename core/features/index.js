const createLocalServer = require( './create_local_server' );
const createLocalTunnel = require( './create_local_tunnel' );

module.exports = {
  async init( emitter ) {
    let server;
    let serverUrl;

    try {
      server = await createLocalServer( 9333, emitter );
    } catch ( err ) {
      console.log( 'Error starting locl server', err );
      throw err;
    }

    try {
      serverUrl = await createLocalTunnel( server.address().port );
    } catch ( err ) {
      console.log( 'Error starting local tunnel', err );
      throw err;
    }
    return { serverUrl };

  }
};
