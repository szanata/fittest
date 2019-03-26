const createLocalServer = require( './create_local_server' );
const createNgrok = require( './create_ngrok' );

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
      serverUrl = await createNgrok( server.address().port );
    } catch ( err ) {
      console.log( 'Error starting ngrok', err );
      throw err;
    }
    return { serverUrl };

  }
};
