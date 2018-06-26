module.exports = {

  createContext() {
    return { };
  },

  async exec( env, ctx, logger ) {
    logger.step( 'This is a test without rollback!' );
  }
};
