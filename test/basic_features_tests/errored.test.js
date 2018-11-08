fittest( 'Broken test', test => {

  test.step( 'Broken test', ctx => {
    throw new Error('foo shakalaka foo');
  } );
} );
