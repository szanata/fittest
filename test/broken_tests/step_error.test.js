fittest( 'Context test', test => {

  test.before( ctx => {} );

  test.step( 'Step 1', ctx => {} ).undo( ctx => {} );

  test.step( 'Step 2', ctx => {} ).undo( ctx => {} );

  test.step( 'Step 3', ctx => {
    throw new Error( 'This step was flake anyway');
  } ).undo( ctx => {} );

  test.step( 'Step 4', ctx => {} ).undo( ctx => {} );

  test.after( ctx => {} );
} );
