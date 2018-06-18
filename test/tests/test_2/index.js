module.exports = {

  createContext() {
    return { };
  },

  exec( env, ctx, logger ) {
    logger.flow( 'Test 2')
    logger.ok( 'Execution 2 done' );
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback 2 done' );
  }
};
