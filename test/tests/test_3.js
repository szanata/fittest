module.exports = {

  createContext() {
    return { };
  },

  async exec( env, ctx, logger ) {
    logger.flow( 'Test 3')
    logger.step( 'This should timeout');
    try {
      await env.asyncEvent( 'foo-bar', 10 );
    } catch (err) {
      logger.ok( 'Timed out');
    }
    logger.ok( 'Execution 3 done' );
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback 3 done' );
  }
};
