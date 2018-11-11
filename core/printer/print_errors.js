const printErrors = ( type, result ) => {
  // console.log( type, result.err );
};

module.exports = fwResult => {
  if ( fwResult.states.beforeAll ) {
    printErrors( 'beforeAll', fwResult.states.beforeAll.result );
  }

  if ( fwResult.states.afterAll ) {
    printErrors( 'afterAll', fwResult.states.afterAll.result );
  }

  fwResult.states.tests.forEach( test => {
    printErrors( 'before', test.result );

    test.beforeHooks.forEach( hook => printErrors( 'before', hook.result ) );
    test.afterHooks.forEach( hook => printErrors( 'before', hook.result ) );

    test.steps.forEach( step => {
      step.beforeHooks.forEach( hook => printErrors( 'beforeEach', hook.result ) );
      step.afterHooks.forEach( hook => printErrors( 'afterEach', hook.result ) );
      printErrors( 'main', step.main.result );
      if ( step.undoHook ) {
        printErrors( 'undo', step.undoHook.result );
      }
    } );
  } );
};
