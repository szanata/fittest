const axios = require( 'axios' );

fittest( 'Async events that happen after the test ends', test => {

  test.step( 'receiving webhook after the test ends', () => {
    axios.get( `${test.env.serverUrl}` );
  } );

  test.step( 'promise reject after the test ends', () => {
    new Promise( ( _, rj ) => {
      setImmediate( () => rj() );
    } );
  } );

  test.step( 'timeout throw error after the test ends', () => {
    setTimeout( () => {
      throw new Error( 'OMG!' );
    } );
  } );
} );
