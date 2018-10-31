module.exports = {

  before( env, ctx, logger ) {
    ctx.set( 'foo', 'bar' );
    logger.log( 'Setting up a ctx' );
  },

  exec( env, ctx, logger ) {
    ctx.set( 'foo', 'zum' );
    logger.log( 'Updating the ctx' );
  },

  after( env, ctx, logger ) {
    logger.log( 'Checking the ctx' );
    if ( ctx.get( 'foo' ) !== 'zum' ) {
      throw new Error( 'Context was not shared' );
    }
    logger.ok( 'Everything went well' );
  }
};
