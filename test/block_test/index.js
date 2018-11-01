module.exports = {
  exec( _, ctx, logger ) {
    if ( !ctx.get( 'beforeAllValue' ) ) {
      throw new Error( 'beforeAllValue was not shared' );
    }
    logger.ok( 'Tests ok!' );
    ctx.set( 'testsValue', true );
  }
};
