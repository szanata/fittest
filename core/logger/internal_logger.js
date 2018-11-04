const format = require( './logger_methods/format_framework_output' );
const { bgYellow, bgRed, bgBlue, bgGreen } = require( './logger_methods/std_vars' );

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
    flow: m => log( format( { color: bgBlue, label: 'Flow', message: m } ) ),
    done: m => log( format( { color: bgYellow, label: 'Done', message: m } ) ),
    pass: m => log( format( { color: bgGreen, label: 'Pass', message: m } ) ),
    fail: m => log( format( { color: bgRed, label: 'Fail', message: m } ) ),
    spinStart() {
      let counter = 0;
      spinLoop = setInterval( () => {
        counter++;
        if ( counter > 10 ) {
          counter = 0;
        }
        clearCurrentLine();
        process.stdout.write( `Processing tests: ${Array( counter ).fill( '#' ).join( '' )}` );
      }, 100 );
    },
    spinStop() {
      clearInterval( spinLoop );
      clearCurrentLine();
    }
  };
};
