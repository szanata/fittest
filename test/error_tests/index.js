module.exports = {

  exec( env, ctx, logger ) {
    logger.step( 'Running test that throws error' );
    throw new Error( 'Oops!' );
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback ok!' );
  }

};
