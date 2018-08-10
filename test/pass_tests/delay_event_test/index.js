const rp = require( 'request-promise' );

module.exports = {

  async exec( env, ctx, logger ) {
    logger.info( 'This test ensures that .asyncEvent is beign triggered even if the event already happened' );

    logger.log( 'Doing a get to the server url' );
    rp( env.serverUrl );

    logger.log( 'Awaiting before registering an event' );
    await new Promise( resolve => setTimeout( () => resolve(), 1000 ) );

    logger.ok( 'Registering the event' );
    await env.asyncEvent( 'http-get' );
    logger.ok( 'Request received!' );

    logger.ok( 'Execution 1 done' );
  }
};
