module.exports = {

  async exec( env, ctx, logger ) {
    logger.info( 'This test will take forever' );
    return new Promise( resolve => {
      setTimeout( () => {
        resolve();
      }, 999999 );
    } );

    throw new Error( 'This line should not be evaluated' );
  },

  after( env, ctx, logger ) {
    logger.ok( 'Rollback!' );
  }
};
