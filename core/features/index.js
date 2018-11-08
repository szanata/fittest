const createLocalServer = require( './create_local_server' );
const createNgrok = require( './create_ngrok' );

module.exports = {
  async init( emitter ) {
    const server = await createLocalServer( 9333, emitter );
    // const serverUrl = await createNgrok( server.address().port );
    const serverUrl = 'http://locahost:9333';

    return { serverUrl };
  }
};
