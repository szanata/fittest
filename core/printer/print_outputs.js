const vars = require( '../utils/console/std_vars' );
const printTitle = require( './print_title' );

const colors = {
  info: vars.fg.blue,
  warn: vars.fg.yellow,
  log: vars.fg.white,
  error: vars.fg.red
};

const filterInnerFrames = stack =>
  stack.split( '\n' ).filter( p => !p.includes( '/fittest/core' ) ).join( '\n' );

const supportedMethods = Object.keys( colors );

const printOutputs = ( buffer, runnable, label, superlabel ) => {
  const err = runnable.result.err;
  const outputs = runnable.outputs ?
    runnable.outputs
      .filter( ( { method } ) => supportedMethods.includes( method ) ) :
    [];

  if ( outputs.length === 0 && !err ) { return; }

  if ( superlabel ) {
    buffer.push( [ vars.fg.cyan + vars.dim + superlabel + vars.reset ] );
  }
  buffer.push( [ vars.fg.cyan + label + vars.reset ] );

  outputs.forEach( ( { method, args } ) => {
    buffer.push( [ `${colors[method]}${vars.bright}(${method[0]})${vars.reset}`, ...args ] );
  } );

  if ( err ) {
    const parts = filterInnerFrames( err.stack ).split( '\n' );
    parts[0] = parts[0] + vars.dim;
    const stack = parts.join( '\n' );
    buffer.push( [ `${vars.bright}${vars.fg.red}(throw)${vars.reset} ${stack}${vars.reset}` ] );
  }

  buffer.push( [ '' ] );
};
module.exports = fwResult => {
  const buffer = [];

  if ( fwResult.states.beforeAll ) {
    printOutputs( buffer, fwResult.states.beforeAll, '[Block] beforeAll' );
  }

  if ( fwResult.states.afterAll ) {
    printOutputs( buffer, fwResult.states.afterAll, '[Block] afterAll' );
  }

  fwResult.states.tests.forEach( test => {
    const retryLabel = test.retries > 0 ? ` (retry ${test.retries})` : '';
    const testHeader = `[Test] "${test.name}"${retryLabel}`;

    printOutputs( buffer, test, testHeader );

    test.beforeHooks.concat( test.afterHooks )
      .forEach( hook => printOutputs( buffer, hook, `${testHeader} (${hook.type}):` ) );

    test.steps.forEach( step => {
      const stepHeader = `[Step] "${step.name}"`;

      step.beforeHooks.concat( step.afterHooks )
        .forEach( hook => printOutputs( buffer, hook, `${stepHeader} (${hook.type}):`, testHeader ) );

      printOutputs( buffer, step.main, `${stepHeader} (main):`, testHeader );
      if ( step.undoHook ) {
        printOutputs( buffer, step.undoHook, `${stepHeader} (${step.undoHook.type}):`, testHeader );
      }
    } );
  } );

  if ( buffer.length > 0 ) {
    printTitle( 'Outputs' );
    buffer.forEach( args => console.log( ...args ) );
    console.log();
  }
};
