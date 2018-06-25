const logTag = require( './logger_methods/log_tag' );
const logSub = require( './logger_methods/log_sub' );
const { blue, green, red } = require( './logger_methods/std_vars' );

const clearCurrentLine = () => {
  process.stdout.clearLine();
  process.stdout.cursorTo( 0 );
};

const log = info => {
  clearCurrentLine();
  console.log( info );
};

module.exports = () => {
  let spinLoop;

  return {
    flow: m => log( logTag( { color: blue, label: 'Flow', message: m } ) ),
    ok: m => log( logTag( { color: green, label: ' Ok ', message: m } ) ),
    pass: m => log( logTag( { color: green, label: 'Pass', message: m } ) ),
    fail: m => log( logTag( { color: red, label: 'Fail', message: m } ) ),
    error: ( m, details ) => {
      log( logTag( { color: red, label: 'Err!', message: m } ) );
      if ( details ) {
        log( logSub( { label: 'Details', text: details } ) );
      }
    },
    spinStart() {
      let counter = 0;
      spinLoop = setInterval( () => {
        counter++;
        if ( counter > 10 ) {
          counter = 0;
        }
        clearCurrentLine();
        process.stdout.write( `Processing tests: ${new Array( counter ).fill( '#' ).join( '' )}` );
      }, 100 );
    },
    spinStop() {
      clearInterval( spinLoop );
      clearCurrentLine();
    }
  };
};
