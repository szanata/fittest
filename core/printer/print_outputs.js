const vars = require( '../utils/console/std_vars' );
const printTitle = require( './print_title' );

const colors = {
  info: vars.fg.blue,
  warn: vars.fg.yellow,
  log: vars.fg.white,
  error: vars.fg.red
};

const filterInnerFrames = stack => 
  stack.split('\n').filter( p => !p.includes( '/fittest/core' ) ).join('\n');

const supportedMethods = Object.keys( colors );

const printOutputs = ( runnable, label, superlabel ) => {
  const err = runnable.result.err;
  const outputs = runnable.outputs ?
    runnable.outputs
      .filter( ( { method } ) => supportedMethods.includes( method ) ) :
    [];

  if ( outputs.length === 0 && !err ) { return; }

  if ( superlabel ) {
    console.log( vars.fg.cyan + vars.dim + superlabel + vars.reset );
  }
  console.log( vars.fg.cyan + label + vars.reset );

  outputs.forEach( ( { method, args } ) => {
    process.stdout.write( `${colors[method]}${vars.bright}(${method[0]})${vars.reset} ` );
    console.log( ...args );
  } );

  if ( err ) {
    const parts = filterInnerFrames( err.stack ).split( '\n' );
    parts[0] = parts[0] + vars.dim;
    const stack = parts.join( '\n' );
    console.log( `${vars.bright}${vars.fg.red}(throw)${vars.reset} ${stack}${vars.reset}` );
  }

  console.log();
};
module.exports = fwResult => {

  printTitle( 'Outputs' );

  if ( fwResult.states.beforeAll ) {
    printOutputs( fwResult.states.beforeAll, '[Block] beforeAll' );
  }

  if ( fwResult.states.afterAll ) {
    printOutputs( fwResult.states.afterAll, '[Block] afterAll' );
  }

  fwResult.states.tests.forEach( test => {
    const retryLabel = test.retries > 0 ? ` (retry ${test.retries})` : '';
    const testHeader = `[Test] "${test.name}"${retryLabel}`;

    printOutputs( test, testHeader );

    test.beforeHooks.concat( test.afterHooks )
      .forEach( hook => printOutputs( hook, `${testHeader} (${hook.type}):` ) );

    test.steps.forEach( step => {
      const stepHeader = `[Step] "${step.name}"`;

      step.beforeHooks.concat( step.afterHooks )
        .forEach( hook => printOutputs( hook, `${stepHeader} (${hook.type}):`, testHeader ) );

      printOutputs( step.main, `${stepHeader} (main):`, testHeader );
      if ( step.undoHook ) {
        printOutputs( step.undoHook, `${stepHeader} (${step.undoHook.type}):`, testHeader );
      }
    } );
  } );

  console.log();
};
