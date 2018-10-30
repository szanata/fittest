module.exports = {
  
  exec( env, ctx, logger ) {
    logger.info( 'Test with invalid syntax' );
    1 = 2;
  },

  after( env, ctx, logger ) {
    logger.ok( 'Rollback!' );
  }
};
