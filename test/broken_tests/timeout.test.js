fittest( 'Timeout test', test => {
  test.step( 'Timing out!', () => {
    return new Promise( resolve => {
      setTimeout( () => {
        resolve();
      }, 999999 );
    } );
  });
});
