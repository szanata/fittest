module.exports = {

  createContext() {
    return { };
  },

  exec( env, ctx, logger ) {
    logger.ok( 'Execution 3 done' );
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback 3 done' );
  }
};
