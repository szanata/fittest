module.exports = ( env, ctx, logger ) => {
  if ( !env.serverUrl ) {
    throw Error( 'afterAll does not have env var' );
  }

  if ( !ctx.get( 'beforeAllValue' ) ) {
    throw new Error( 'beforeAllValue was not shared' );
  }

  if ( ctx.get( 'testsValue' ) ) {
    throw new Error( 'testsValue should not be set' );
  }

  logger.ok( 'afterAll block ok' );
};
