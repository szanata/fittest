module.exports = ( env, ctx, logger ) => {
  if ( env.serverUrl ) {
    logger.ok( 'beforeAll block ok' );
    ctx.set( 'beforeAllValue', true );
  } else {
    throw Error( 'beforeAll does not have env var' );
  }
};
