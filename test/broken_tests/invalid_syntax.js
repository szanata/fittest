module.exports = {

  createContext() {
    return { };
  },

  async exec( env, ctx, logger ) {
    logger.flow( 'Test with invalid syntax' );
    1 = 2;
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback!' );
  }
};
