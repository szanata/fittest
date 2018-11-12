const msToS = require( '../utils/time/ms_to_s' );
const vars = require( '../utils/console/std_vars' );
const bc = require( '../utils/console/box_chars' );
const repeatChar = require( '../utils/console/print/repeat_char' );

const colors = {
  before: vars.fg.magenta + vars.dim,
  after: vars.fg.magenta,
  h1: vars.fg.cyan + vars.bright,
  h2: vars.fg.cyan,
  undo: vars.fg.blue + vars.dim,
  main: vars.fg.blue
};

const gridLayout = [ 59, 6, 11 ];
const columnsLabels = [ 'Function', 'Err', 'Time' ];

// const printGridTop = () => console.log(
//   bc.extras.round.cnr.tl +
//   gridLayout.map( size => repeatChar( size, bc.box.thin.h ) ).join( bc.box.thin.conn.t ) +
//   bc.extras.round.cnr.tr
// );

const printGridBottom = () => console.log(
  bc.extras.round.cnr.bl +
  gridLayout.map( size => repeatChar( size, bc.box.thin.h ) ).join( bc.box.thin.conn.b ) +
  bc.extras.round.cnr.br
);

const printHeaderBottom = () => console.log(
  bc.box.thin.conn.l +
  gridLayout.map( size => repeatChar( size, bc.box.thin.h ) ).join( bc.box.thin.conn.c ) +
  bc.box.thin.conn.r
);

const printBoldLine = () => console.log(
  bc.box.thin.conn.l +
  gridLayout.map( size => repeatChar( size, bc.box.thin.h ) ).join( bc.box.thin.conn.c ) +
  bc.box.thin.conn.r
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
      bc.box.thin.v +
      gridLayout.map( ( size, col ) => {
        const text = matrix[col][line] || '';
        return infoColor + ` ${text}`.padEnd( size, ' ' ) + vars.reset;
      } ).join( bc.box.thin.v ) +
      bc.box.thin.v
    );
  } );
};

const printEmptyRow = () => printRow( [ ' ', ' ', ' ' ] );

const colorize = ( ok, color ) => ( ok ? color : vars.fg.red + vars.strikethrough );

const printHeader = () => {
  const title = 'Detailed timing';
  const top = bc.extras.round.cnr.tl + repeatChar( title.length + 2, bc.box.thin.h ) + bc.extras.round.cnr.tr;
  console.log( top );
  console.log( bc.box.thin.v + ` ${title} ` + bc.box.thin.v );

  const topLine = bc.box.thin.conn.l +
    gridLayout.map( size => repeatChar( size, bc.box.thin.h ) ).join( bc.box.thin.conn.t ) +
    bc.extras.round.cnr.tr;

  const connIndex = top.length - 1;
  const connChar = topLine[connIndex] === bc.box.thin.conn.t ? bc.box.thin.conn.c : bc.box.thin.conn.b;
  const topLineArr = topLine.split( '' );
  topLineArr.splice( connIndex, 1, connChar );

  console.log( topLineArr.join( '' ) );
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

      const retryLabel = test.retries > 0 ? ` (retry ${test.retries})` : '';
      printLine( `[Test] "${test.name}"${retryLabel}`, test.result, colors.h1 );

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
  console.log();
};
