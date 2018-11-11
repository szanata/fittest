const vars = require( '../utils/console/std_vars' );
const { printTitle } = require( './tools' );
const bc = require( '../utils/console/box_chars' );

const colors = {
  info: vars.fg.blue,
  warn: vars.fg.yellow,
  log: vars.fg.white,
  error: vars.fg.red
};

const supportedMethods = Object.keys( colors );

const printOutputs = ( runnable, label, superlabel ) => {
  const outputs = runnable.outputs
    .filter( ( { method } ) => supportedMethods.includes( method ) );

  if ( outputs.length === 0 ) { return; }

  if ( superlabel ) {
    console.log( vars.fg.cyan + vars.dim + superlabel + vars.reset );
  }
  console.log( vars.fg.cyan + label + vars.reset );
  console.log( ` ${bc.box.thin.v}` );

  outputs.forEach( ( { method, args }, i, arr ) => {
    const last = i === arr.length - 1;
    const char = last ? bc.box.thin.cnr.bl : bc.box.thin.conn.l;
    const spacing = Array( 6 - method.length ).fill( bc.box.thin.h ).join( '' );
    process.stdout.write( ` ${char}${spacing}${colors[method]}${vars.bright}${method}:${vars.reset} ` );
    console.log( ...args );
  } );

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
    const testHeader = `[Test] "${test.name}"`;

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
