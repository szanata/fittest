const sleep = t => new Promise( r => setTimeout( () => r(), t ) );

fittest( 'Phases sequence test', test => {

  test.before( async () => {
    await sleep( 30 );
  } );

  test.beforeEach( async () => {
    await sleep( 77 );
  } );

  test.afterEach( async () => {
    await sleep( 23 );
  } );

  test.step( 'Step 1 with undo', async () => {
    await sleep( 51 );
  } ).undo( async () => {
    await sleep( 44 );
  } );

  test.step( 'Step 2 with undo', async () => {
    await sleep( 103 );
  } ).undo( async () => {
    await sleep( 109 );
  } );

  test.step( 'Step 3', async () => {
    await sleep( 59 );
  } );

  test.step( 'Step 4 with undo', async () => {
    await sleep( 29 );
  } ).undo( async () => {
    await sleep( 71 );
  } );

  test.after( async () => {
    await sleep( 67 );
  } );
} );
