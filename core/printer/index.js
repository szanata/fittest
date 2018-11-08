const vars = require( './std_vars' );
const bc = require( './box_chars' );
// const lineSize = 80;
const ProgressBar = require( './progress_bar' );
const msToS = require( '../utils/time/ms_to_s' );
const { repeatChar } = require( './tools' );

const repeatStart = ( start, t, c ) => start + Array( t + 1 - start.length ).join( c );

const formatBool = b => b ? '' : ' X ';

const colors = {
  block: {
    beforeAll: vars.fg.magenta + vars.dim,
    afterAll: vars.fg.magenta
  },
  tests: {
    header: vars.fg.cyan,
    test: {
      header: vars.fg.cyan + vars.bright,
      hooks: {
        before: vars.fg.magenta + vars.dim,
        after: vars.fg.magenta
      },
      steps: {
        header: vars.fg.cyan,
        main: vars.fg.blue,
        hooks:{
          before: vars.fg.magenta + vars.dim,
          after: vars.fg.magenta,
          undo: vars.fg.blue + vars.dim
        }
      }
    }
  }
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

const printThinLine = () => console.log(
  bc.tx.conn.r.tbb +
  gridLayout.map( size => repeatChar( bc.box.thin.h, size ) ).join( bc.box.thin.conn.c ) +
  bc.tx.conn.l.btb
);

const printBoldLine = () => console.log(
  bc.box.bold.conn.l +
  gridLayout.map( size => repeatChar( bc.box.bold.h, size ) ).join( bc.tx.conn.c.tbtb ) +
  bc.box.bold.conn.r
);

const printRow = ( info, infoColor = '' ) => {
  const matrix = gridLayout.map( (len, col ) =>
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

const colorize = ( ok, color ) => (ok ? color : vars.fg.red + vars.strikethrough );

const printHeader = () => {
  printRow( columnsLabels );
  console.log(
    bc.box.bold.conn.l +
    gridLayout.map( size => repeatChar( bc.box.bold.h, size ) ).join( bc.tx.conn.c.tbtb ) +
    bc.box.bold.conn.r
  );
};


const formatResult = r => [ formatBool( r.ok ), `${msToS( r.et )}s` ];

module.exports = {
  result( fwResult ) {
    console.log( `Tests ${fwResult.ok ? 'passed' : 'failed' }` );

    console.log( 'Detailed Breakdown' );
    printGridTop();
    printHeader();

    if ( fwResult.states.beforeAll ) {
      const r = formatResult( fwResult.states.beforeAll.result );
      const color = colorize( fwResult.states.beforeAll.result.ok, colors.before );
      printRow( [ '[Block] beforeAll', r[0], r[1] ], vars.fg.magenta + vars.dim );
    }

    if ( fwResult.states.afterAll ) {
      const r = formatResult( fwResult.states.afterAll.result );
      const color = colorize( fwResult.states.afterAll.result.ok, colors.after );
      printRow( [ '[Block] afterAll', r[0], r[1] ], vars.fg.magenta );
    }

    const testsCount = fwResult.states.tests.length;
    if ( testsCount > 0 ) {
      const r = formatResult( fwResult.testsResult );
      const c = colorize( fwResult.testsResult.ok, colors.tests.header );
      printRow( [ `[Tests] ${testsCount} in total`, r[0], r[1] ], c );
      printBoldLine();

      fwResult.states.tests.forEach( (test, testI) => {
        if ( testI > 0 ) {
          printRow( [' ',' ',' '] );  
        }

        const tr = formatResult( test.result );
        const tc = colorize( test.result.ok, colors.tests.test.header );
        printRow( [`[Test] "${test.name}"`, tr[0], tr[1]], tc );

        test.beforeHooks.forEach( hook => {
          const hr = formatResult( hook.result );
          const hc = colorize( hook.result.ok, colors.tests.test.before );
          printRow( [` (${hook.type})`, hr[0], hr[1]], hc );
        } );

        test.afterHooks.forEach( hook => {
          const hr = formatResult( hook.result );
          const hc = colorize( hook.result.ok, colors.tests.test.after );
          printRow( [` (${hook.type})`, hr[0], hr[1]], hc );
        } );

        test.steps.forEach( step => {
          const sr = formatResult( step.result );
          const sc = colorize( step.result.ok, colors.tests.test.steps.header );
          printRow( [` [Step] "${step.name}"`, sr[0], sr[1]], sc );

          step.beforeHooks.forEach( hook => {
            const hr = formatResult( hook.result );
            const hc = colorize( hook.result.ok, colors.tests.test.steps.hooks.before );
            printRow( [`  (${hook.type})`, hr[0], hr[1]], sc );
          } );

          step.afterHooks.forEach( hook => {
            const hr = formatResult( hook.result );
            const hc = colorize( hook.result.ok, colors.tests.test.steps.hooks.after );
            printRow( [`  (${hook.type})`, hr[0], hr[1]], sc );
          } );

          const mr = formatResult( step.main.result );
          const mc = colorize( step.main.result.ok, colors.tests.test.steps.main );
          printRow( ['  (main)', mr[0], mr[1]], mc );

          if ( step.undoHook ) {
            const hr = formatResult( step.undoHook.result );
            const hc = colorize( step.undoHook.result.ok, colors.tests.test.steps.hooks.undo );
            printRow( [`  (${step.undoHook.type})`, hr[0], hr[1]], hc );
          }
        } );

      } );
    }
    
    printGridBottom();
  },
  startup( fwEnv ) {
    // console.log( '' );
    // console.debug( { fwEnv } );
  },
  listenUpdates( emitter, fwEnv ) {
    const progressBar = ProgressBar.init( fwEnv.tasksCount );
    emitter.on( 'task_done', () => progressBar.update( ) );
  }
};


// const prefix = `${setSpace( 3 )}└${clear}${spc}${color}`;

//   const lines = messages
//     .map( m => JSON.stringify( m ) ) // parse every message
//     .map( m => m.replace( /^"|"$/g, '' ) ) // remove wrap around quotes (when parsing strings as json)
//     .join( ' ' ) // join to keep messages in the same line
//     .split( '\\n' ) // split those that have \n into lines
//     .map( m => m.match( /.{1,80}/g ) ) // further break lines into lines with less than 80 chars
//     .reduce( ( arr, m ) => arr.concat( m ), [] ); // flatten
