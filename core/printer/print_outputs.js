const vars = require( '../utils/console/std_vars' );
const { repeatChar } = require( './tools' );
const bc = require( '../utils/console/box_chars' );
const colors = {
  info: vars.fg.blue,
  warn: vars.fg.yellow,
  log: vars.fg.white,
  error: vars.fg.red
};

const supportedMethods = Object.keys( colors );

const printOutputs = ( label, runnable) => {
  if ( runnable.outputs.length === 0) { return; }

  console.log( vars.bright + label + vars.reset );
  console.log( repeatChar( bc.box.thin.h, 80 ) );
  runnable.outputs.forEach( ( { method, args } ) => {
    if ( !supportedMethods.includes( method ) ) { return; }

    process.stdout.write( colors[method] + `{${method}} ` );
    console.log( ...args )
  });
  console.log('');
};
module.exports = fwResult => {
  
  console.log( 'Outputs' );

  if ( fwResult.states.beforeAll ) {
    printOutputs( '[Block] beforeAll', fwResult.states.beforeAll );
  }

  if ( fwResult.states.afterAll ) {
    printOutputs( '[Block] afterAll', fwResult.states.afterAll );
  }

  fwResult.states.tests.forEach( test => {
    const testHeader = `[Test] "${test.name}"`;
    test.beforeHooks.forEach( hook => printOutputs( `${testHeader} (${hook.type}):`, hook ) );
    test.afterHooks.forEach( hook => printOutputs( `${testHeader} (${hook.type}):`, hook ) );
    test.steps.forEach( step => {
      const stepHeader = `${testHeader}\n[Step] "${step.name}"`;
      step.beforeHooks.forEach( hook => printOutputs( `${stepHeader} (${hook.type}):`, hook ) );
      step.afterHooks.forEach( hook => printOutputs( `${stepHeader} (${hook.type}):`, hook ) );
      printOutputs( `${stepHeader} (main):`, step.main );
      if ( step.undoHook ) {
        printOutputs( `${stepHeader} (${step.undoHook.type}):`, step.undoHook );
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
