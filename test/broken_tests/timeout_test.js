module.exports = {

  createContext() {
    return { };
  },

  async exec( env, ctx, logger ) {
    logger.step( 'This test will take forever' );
    return new Promise( resolve => {
      setTimeout( () => {
        resolve();
      }, 999999 );
    } );
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback!' );
  }
};
