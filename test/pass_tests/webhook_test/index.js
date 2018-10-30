const axios = require( 'axios' );

module.exports = {

  async exec( env, ctx, logger ) {
    logger.info( 'Test 1' );

    const values = Array.from( { length: 2 } ).map( () => String( Math.ceil( Math.random() * 1000 ) ) );

    logger.log( 'Sending a get to the server url passing value 1' );
    axios.get( `${env.serverUrl}?data=${values[0]}` );

    logger.log( 'Sending a get to the server url passing value 2' );
    axios.get( `${env.serverUrl}?data=${values[1]}` );

    const { qs: qs1 } = await env.asyncEvent( 'http-get' );
    logger.ok( 'Received value one' );

    if ( qs1.data !== values[0] ) {
      throw new Error( `Query string data for the first call should be ${values[0]} but ${qs1.data} was received.` );
    }

    const { qs: qs2 } = await env.asyncEvent( 'http-get' );
    logger.ok( 'Received value two' );

    if ( qs2.data !== values[1] ) {
      throw new Error( `Query string data for the first call should be ${values[1]} but ${qs2.data} was received.` );
    }

    logger.ok( 'Execution 1 done' );
  }
};
