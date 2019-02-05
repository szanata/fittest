const { expect } = require( 'chai' );
const { randomBytes } = require( 'crypto' );
const uniqValue = randomBytes( 12 ).toString( 'hex' );

fittest( 'P1', test => {

  test.step( 'Setting ctx', ctx => {
    ctx.set( 'test_var', uniqValue );
  } );

  test.step( 'Reading ctx 2', async ctx => {

    expect( ctx.get( 'test_var' ) ).to.eql( uniqValue );
    await new Promise( r =>
      setTimeout( ( ) => {
        ctx.set( 'test_var', uniqValue );
        r();
      }, 1000 ) );
  } );

  test.step( 'Final assertion', ctx => {

    expect( ctx.get( 'test_var' ) ).to.eql( uniqValue );
  } );
} );
