fittest( 'Basic Features Test', test => {

  test.step( 'Basic test step 1', () => {
    console.log( 'Doing basic step 1' );
  } ).undo( () => {
    console.log( 'Undoing basic step 1' );
  } );

  test.step( 'Basic test step 2', () => {
    console.log( 'Doing basic step 2' );
  } ).undo( () => {
    console.log( 'Undoing basic step 2' );
  } );

} );
