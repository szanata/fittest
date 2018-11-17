fittest( 'Fail undo test', test => {

  test.before( ctx => {} );

  test.step( 'Step 1', ctx => {} ).undo( ctx => {} );

  test.step( 'Step 2', ctx => {} ).undo( ctx => {} );

  test.step( 'Step 3', ctx => {} ).undo( ctx => {} );

  test.step( 'Step 4', ctx => {} ).undo( ctx => {} );

  test.step( 'Step 5: Undo will fail, buck all undos before should be invoked', ctx => {} ).undo( ctx => {
    throw new Error();
  } );

  test.after( ctx => {} );
} );
