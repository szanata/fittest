module.exports = {

  before( env, ctx, logger ) {
    ctx.foo = 'bar';
    logger.log( 'Setting up a ctx' );
  },

  exec( env, ctx, logger ) {
    ctx.bar = 'foo';
    logger.log( 'Updating the ctx' );
  },

  after( env, ctx, logger ) {
    logger.log( 'Checking the ctx' );
    if ( ctx.foo !== 'bar' ) {
      throw new Error( 'context was not shared' );
    }
  }
};
