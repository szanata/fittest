module.exports = {

  exec( ) {
    throw new Error('fail');
  },

  after( env, ctx, logger ) {
    logger.ok( 'Rollback!' );
  }
};
