const rp = require( 'request-promise' );

module.exports = {

  createContext() {
    return { };
  },

  async exec( env, ctx, logger ) {
    logger.step( 'Execution 1 start' );

    logger.step( 'Doing a get to the server url' );
    rp( env.serverUrl );

    await env.asyncEvent( 'http-get' );
    logger.ok( 'Request received!' );

    logger.ok( 'Execution 1 done' );
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback 1 done' );
  }
};
