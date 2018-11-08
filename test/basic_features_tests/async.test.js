fittest( 'Async test', test => {

  test.step( 'Awaiting for async executing', ctx => {
    return new Promise( resolve => {
      setTimeout( () => {
        ctx.set( 'done', true );
        resolve();
      }, 3000 );
    } );
  } );

  test.after( ctx => {
    if ( !ctx.get( 'done') ) {
      throw new Error( 'Didn\'t await execution' );
    }
  })
} );
