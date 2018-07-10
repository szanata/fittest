module.exports = {

  async exec( env, ctx, logger ) {
    logger.log( 'This should timeout' );
    try {
      await env.asyncEvent( 'foo-bar', 10 );
    } catch ( err ) {
      logger.ok( 'Timed out' );
    }
    logger.ok( 'Execution done' );
  }
};
