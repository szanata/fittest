const printOutput = (type, runnable) => {
  // console.log( type, runnable.output );
};
module.exports = fwResult => {
  if ( fwResult.states.beforeAll ) {
    printOutput( 'beforeAll', fwResult.states.beforeAll );
  }

  if ( fwResult.states.afterAll ) {
    printOutput( 'afterAll', fwResult.states.afterAll );
  }

  fwResult.states.tests.forEach( test => {
    test.beforeHooks.forEach( hook => printOutput( 'before', hook ) );
    test.afterHooks.forEach( hook => printOutput( 'after', hook ) );
    test.steps.forEach( step => {
      step.beforeHooks.forEach( hook => printOutput( 'beforeEach', hook ) );
      step.afterHooks.forEach( hook => printOutput( 'afterEach', hook ) );
      printOutput( 'main', step.main );
      if ( step.undoHook ) {
        printOutput( 'undo', step.undoHook );
      }
    } );
  } );
};


// const prefix = `${setSpace( 3 )}└${clear}${spc}${color}`;

//   const lines = messages
//     .map( m => JSON.stringify( m ) ) // parse every message
//     .map( m => m.replace( /^"|"$/g, '' ) ) // remove wrap around quotes (when parsing strings as json)
//     .join( ' ' ) // join to keep messages in the same line
//     .split( '\\n' ) // split those that have \n into lines
//     .map( m => m.match( /.{1,80}/g ) ) // further break lines into lines with less than 80 chars
//     .reduce( ( arr, m ) => arr.concat( m ), [] ); // flatten
