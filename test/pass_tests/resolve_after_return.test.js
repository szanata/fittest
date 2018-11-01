const axios = require( 'axios' );

module.exports = {

  async exec( env, ctx, logger ) {
    logger.info( 'This will trigger a internal event emission after this test is already finished' );

    setTimeout( () => {
      axios.get( `${env.serverUrl}` );
    }, 3000 );

    logger.ok( 'Finishing test' );
  }
};
