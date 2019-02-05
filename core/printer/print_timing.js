const msToS = require( '../utils/time/ms_to_s' );
const vars = require( '../utils/console/std_vars' );
const bc = require( '../utils/console/box_chars' );
const repeatChar = require( '../utils/console/print/repeat_char' );
const { mean, zScore, std } = require( '../utils/math' );

const colors = {
  before: vars.fg.magenta + vars.dim,
  after: vars.fg.magenta,
  h1: vars.fg.cyan + vars.bright,
  h2: vars.fg.cyan,
  undo: vars.fg.blue + vars.dim,
  main: vars.fg.blue
};

const gridLayout = [ 68, 9 ];
const columnsLabels = [ 'Feature', 'Time' ];

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
    Array( Math.ceil( info[col].length / ( len - 1 ) ) ).fill().map( ( _, i ) =>
      info[col].substring( ( len - 1 ) * i, ( len - 1 ) * ( i + 1 ) )
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

const printEmptyRow = () => printRow( gridLayout.map( () => ' ' ) );

const colorize = ( ok, invoked, color, overThreshold = false ) => {
  if ( !ok ) {
    return vars.fg.red + vars.strikethrough;
  } else if ( !invoked ) {
    return vars.dim + vars.fg.white;
  } else if ( overThreshold ) {
    return vars.bg.black + color;
  }
  return color;
};

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

const printResult = ( label, result, color ) => {
  const etInfo = `${msToS( result.et )}s`;
  const fmt = colorize( result.ok, true, color );
  printRow( [ label, etInfo ], fmt );
};

const printRunnable = ( label, runnable, color, score = 0 ) => {
  const { result, invoked } = runnable;
  const etInfo = invoked ? `${msToS( result.et )}s` : '-';
  const overThreshold = invoked && score > 3;
  const fmt = colorize( result.ok, invoked, color, overThreshold );
  const text = label + ( !invoked && result.ok ? ' *not invoked' : '' );
  printRow( [ text, etInfo ], fmt );
};

module.exports = fwResult => {
  printHeader();

  if ( fwResult.states.beforeAll ) {
    printRunnable( '[Block] beforeAll', fwResult.states.beforeAll, colors.before );
  }

  if ( fwResult.states.afterAll ) {
    printRunnable( '[Block] afterAll', fwResult.states.afterAll, colors.after );
  }

  const statistics = fwResult.consolidateStatistics();

  const testsCount = fwResult.states.tests.length;
  if ( testsCount > 0 ) {
    printResult( `[Tests] ${testsCount} in total`, fwResult.testsResult, colors.h2 );
    printBoldLine();

    fwResult.states.tests.forEach( ( test, testI ) => {
      if ( testI > 0 ) {
        printEmptyRow();
      }

      const retryLabel = test.retries > 0 ? ` (retry ${test.retries})` : '';
      printRunnable( `[Test] "${test.name}"${retryLabel}`, test, colors.h1 );

      test.beforeHooks.forEach( hook => {
        printRunnable( ` (${hook.type})`, hook, colors.before );
      } );

      test.afterHooks.forEach( hook => {
        printRunnable( ` (${hook.type})`, hook, colors.after );
      } );

      test.steps.forEach( step => {
        const score = zScore( step.result.et, statistics.steps.mean, statistics.steps.std );
        printRunnable( ` [Step] "${step.name}"`, step, colors.h2, score );

        step.beforeHooks.forEach( hook => {
          printRunnable( `  (${hook.type})`, hook, colors.before );
        } );

        step.afterHooks.forEach( hook => {
          printRunnable( `  (${hook.type})`, hook, colors.after );
        } );

        printRunnable( '  (main)', step.main, colors.main );

        if ( step.undoHook ) {
          printRunnable( `  (${step.undoHook.type})`, step.undoHook, colors.undo );
        }
      } );

    } );
  }

  printGridBottom();
  console.log();
};
