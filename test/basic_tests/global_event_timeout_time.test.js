fittest( 'Global event timeout test', test => {
  test.step( 'The asyncEvent should break after 5s', async () => {
    const startTime = Date.now();
    try {
      await test.env.asyncEvent( 'foo-bar' );
    } catch ( _err ) { } // eslint-disable-line no-empty
    const elapsed = Date.now() - startTime;
    if ( elapsed < 5000 || elapsed > 5050 ) {
      throw new Error( 'Ops. It didn\t threw the error in the right time' );
    }
  } );
} );