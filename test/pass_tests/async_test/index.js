module.exports = {

  before( env, ctx, logger ) {
    logger.log( 'Before' );
  },

  exec( env, ctx, logger ) {
    logger.log( 'Execution will have a delay of 3 seconds' );
    return new Promise( resolve => {
      setTimeout( () => {
        logger.ok( 'Execution done' );
        resolve();
      }, 3000 );
    } );
  },

  after( env, ctx, logger ) {
    logger.ok( 'After ok' );
  }
};
