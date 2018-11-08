const axios = require( 'axios' );
const rand = () => String( Math.ceil( Math.random() * 1000 ) );

fittest( 'Webhook tests', test => {

  test.before( ctx => {
    ctx.set( 'values', Array( 2 ).fill().map( rand ) );
  } );

  test.step( 'Making two gets and receiving the values', async ctx => {
    const values = ctx.get( 'values' );

    console.info( `Making a GET to the server sending data=${values[0]}.` );
    axios.get( `${test.env.serverUrl}?data=${values[0]}` );

    console.info( 'Awaiting for the value' );
    const { qs: qs1 } = await test.env.asyncEvent( 'http-get' );

    if ( qs1.data !== values[0] ) {
      throw new Error( `Value expected for the call was "${values[0]}" but it received "${qs1.data}" instead.` );
    }

    console.info( `Making a GET to the server sending data=${values[0]}.` );
    axios.get( `${test.env.serverUrl}?data=${values[1]}` );

    console.info( 'Awaiting for the value' );
    const { qs: qs2 } = await test.env.asyncEvent( 'http-get' );

    if ( qs2.data !== values[1] ) {
      throw new Error( `Value expected for the call was "${values[1]}" but it received "${qs2.data}" instead.` );
    }
  } );
} );
