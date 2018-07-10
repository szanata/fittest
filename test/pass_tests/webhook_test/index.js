const rp = require( 'request-promise' );

module.exports = {

  async exec( env, ctx, logger ) {
    logger.info( 'Test 1' );

    logger.log( 'Doing a get to the server url' );
    rp( env.serverUrl );

    await env.asyncEvent( 'http-get' );
    logger.ok( 'Request received!' );

    logger.ok( 'Execution 1 done' );
  }
};
