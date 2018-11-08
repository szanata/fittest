fittest( 'Context test', test => {

  test.before( ctx => {
    ctx.set( 'before', true );
  } );

  test.beforeEach( ctx => {
    if ( !ctx.get( 'before' ) ) {
      throw new Error( '"before" var was not defined at "beforeEach" hook' );
    }
    ctx.set( 'beforeEach', true );
  } );

  test.afterEach( ctx => {
    ctx.set( 'afterEach', true );
  } );

  test.step( 'Step 1', ctx => {
    if ( !ctx.get( 'before' ) ) {
      throw new Error( '"before" var was not defined at "Step 1"' );
    }
    if ( !ctx.get( 'beforeEach' ) ) {
      throw new Error( '"beforeEach" var was not defined at "Step 1"' );
    }
    ctx.set( 'step1', true );
  } ).undo( async ctx => {
    if ( !ctx.get( 'step1' ) ) {
      throw new Error( '"Step 1" var was not defined at "Step 1" "undo" hook' );
    }
    if ( !ctx.get( 'step2' ) ) {
      throw new Error( '"Step 2" var was not defined at "Step 1" "undo" hook' );
    }
    ctx.set( 'step1.undo', true );
  } );

  test.step( 'Step 2', ctx => {
    if ( !ctx.get( 'step1' ) ) {
      throw new Error( '"Step 1" var was not defined at "Step 2"' );
    }
    ctx.set( 'step2', true );
  } );

  test.after( ctx => {
    if ( !ctx.get( 'step1.undo' ) ) {
      throw new Error( '"Step 1" "undo" var was not defined at "after" hook' );
    }
    if ( !ctx.get( 'afterEach' ) ) {
      throw new Error( '"afterEach" var was not defined at "after" hook' );
    }
  } );
} );
