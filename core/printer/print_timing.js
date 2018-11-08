const msToS = require( '../utils/time/ms_to_s' );
const { repeatChar, repeatStart } = require( './tools' );
const vars = require( '../utils/console/std_vars' );
const bc = require( '../utils/console/box_chars' );

const colors = {
  before: vars.fg.magenta + vars.dim,
  after: vars.fg.magenta,
  h1: vars.fg.cyan + vars.bright,
  h2: vars.fg.cyan,
  undo: vars.fg.blue + vars.dim,
  main: vars.fg.blue
};


const gridLayout = [ 59, 5, 11 ];
const columnsLabels = [ 'Function', 'Err', 'Time' ];

const printGridTop = () => console.log(
  bc.box.bold.cnr.tl +
  gridLayout.map( size => repeatChar( bc.box.bold.h, size ) ).join( bc.tx.conn.t.btb ) +
  bc.box.bold.cnr.tr
);

const printGridBottom = () => console.log(
  bc.box.bold.cnr.bl +
  gridLayout.map( size => repeatChar( bc.box.bold.h, size ) ).join( bc.tx.conn.b.tbb ) +
  bc.box.bold.cnr.br
);

const printHeaderBottom = () => console.log(
  bc.box.bold.conn.l +
  gridLayout.map( size => repeatChar( bc.box.bold.h, size ) ).join( bc.tx.conn.c.tbtb ) +
  bc.box.bold.conn.r
);

// const printThinLine = () => console.log(
//   bc.tx.conn.r.tbb +
//   gridLayout.map( size => repeatChar( bc.box.thin.h, size ) ).join( bc.box.thin.conn.c ) +
//   bc.tx.conn.l.btb
// );

const printBoldLine = () => console.log(
  bc.box.bold.conn.l +
  gridLayout.map( size => repeatChar( bc.box.bold.h, size ) ).join( bc.tx.conn.c.tbtb ) +
  bc.box.bold.conn.r
);

const printRow = ( info, infoColor = '' ) => {
  const matrix = gridLayout.map( ( len, col ) =>
    Array( Math.ceil( info[col].length / len ) ).fill().map( ( _, i ) =>
      info[col].substring( len * i, len * ( i + 1 ) )
    )
  );

  const linesCount = matrix.map( item => item.length ).sort().reverse()[0];

  Array( linesCount ).fill().forEach( ( _, line ) => {
    console.log(
      bc.box.bold.v +
      gridLayout.map( ( size, col ) => {
        const text = matrix[col][line] || '';
        return infoColor + repeatStart( ` ${text}`, size, ' ' ) + vars.reset;
      } ).join( bc.box.thin.v ) +
      bc.box.bold.v
    );
  } );
};

const printEmptyRow = () => printRow( [ ' ', ' ', ' ' ] );

const colorize = ( ok, color ) => ( ok ? color : vars.fg.red + vars.strikethrough );

const printHeader = () => {
  printGridTop();
  printRow( columnsLabels );
  printHeaderBottom( );
};

const printLine = ( label, result, color ) => {
  const okInfo = result.ok ? '' : ' X ';
  const etInfo = `${msToS( result.et )}s`;
  const fmt = colorize( result.ok, color );
  printRow( [ label, okInfo, etInfo ], fmt );
};

module.exports = fwResult => {
  console.log( 'Detailed Breakdown' );

  printHeader();

  if ( fwResult.states.beforeAll ) {
    printLine( '[Block] beforeAll', fwResult.states.beforeAll.result, colors.before );
  }

  if ( fwResult.states.afterAll ) {
    printLine( '[Block] afterAll', fwResult.states.afterAll.result, colors.after );
  }

  const testsCount = fwResult.states.tests.length;
  if ( testsCount > 0 ) {
    printLine( `[Tests] ${testsCount} in total`, fwResult.testsResult, colors.h2 );
    printBoldLine();

    fwResult.states.tests.forEach( ( test, testI ) => {
      if ( testI > 0 ) {
        printEmptyRow();
      }

      printLine( `[Test] "${test.name}"`, test.result, colors.h1 );

      test.beforeHooks.forEach( hook => {
        printLine( ` (${hook.type})`, hook.result, colors.before );
      } );

      test.afterHooks.forEach( hook => {
        printLine( ` (${hook.type})`, hook.result, colors.after );
      } );

      test.steps.forEach( step => {
        printLine( ` [Step] "${step.name}"`, step.result, colors.h2 );

        step.beforeHooks.forEach( hook => {
          printLine( `  (${hook.type})`, hook.result, colors.before );
        } );

        step.afterHooks.forEach( hook => {
          printLine( `  (${hook.type})`, hook.result, colors.after );
        } );

        printLine( '  (main)', step.main.result, colors.main );

        if ( step.undoHook ) {
          printLine( `  (${step.undoHook.type})`, step.undoHook.result, colors.undo );
        }
      } );

    } );
  }

  printGridBottom();
};
