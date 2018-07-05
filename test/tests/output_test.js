module.exports = {

  createContext() {
    return { };
  },

  async exec( env, ctx, logger ) {
    logger.error( 'Test is an error' );
    logger.warn( 'This is a warn' );
    logger.info( 'This is a info' );
    logger.log( 'This is a log' );
    logger.ok( 'This is ok' );
    logger.log( 'This is a log', 'has multiple', 'messages', { including: 'this object' } );
  }
};
