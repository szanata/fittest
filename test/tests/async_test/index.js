module.exports = {

  createContext() {
    return { };
  },

  exec( env, ctx, logger ) {
    logger.flow( 'Test 2' );

    logger.step( 'Execution 2 will have a delay of 3 seconds' );
    return new Promise( resolve => {
      setTimeout( () => {
        logger.ok( 'Execution 2 done' );
        resolve();
      }, 3000 );
    } );
  },

  rollback( env, ctx, logger ) {
    logger.ok( 'Rollback 2 done' );
  }
};
