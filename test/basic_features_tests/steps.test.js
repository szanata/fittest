const sleep = t => new Promise( r => setTimeout( () => r(), t) );

fittest( 'Basic Features Test', test => {

  test.before( async ctx => {
    // console.log( 'Executing before' );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
    await sleep( 150 );
  } );

  test.beforeEach( async ctx => {
    // console.log( 'Executing before each' );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
    await sleep( 100 );
  } );

  test.afterEach( async ctx => {
    // console.log( 'Executing afterEach' );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
    await sleep( 100 );
  } );

  test.step( 'Basic test step 1', async ctx => {
    // console.log( 'Doing basic step 1, setting ctx.zum as 1' );
    await sleep( 50 );
    // ctx.set( 'zum', 1 );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
  } ).undo( async ctx => {
    // console.log( 'Undoing basic step 1' );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
    // console.log( 'ctx.zum', ctx.get( 'zum' ) );
    await sleep( 50 );
  } );

  test.step( 'Basic test step 2', async ctx => {
    // console.log( 'Doing basic step 2, setting ctx.ram as 2' );
    await sleep( 100 );
    // ctx.set( 'ram', 2 );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
  } ).undo( async ctx => {
    // console.log( 'Undoing basic step 2' );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
    // console.log( 'ctx.ram', ctx.get( 'ram' ) );
    await sleep( 100 );
  } );

  test.after( async ctx => {
    // console.log( 'Executing after' );
    // console.log( 'ctx.foo', ctx.get( 'foo' ) );
    await sleep( 150 );
  } );
} );
