const maxLength = 40;
const isCI = require( '../utils/environment/is_ci' );
const vars = require( '../utils/console/std_vars' );
const repeatSpace = require( '../utils/console/print/repeat_space' );
const readline = require( 'readline' );

const clearCurrentLine = () => {
  readline.clearLine( process.stdout );
  readline.cursorTo( process.stdout, 0, null );
};

const createLine = number => {
  const info = `${number}%`;
  const lineSize = maxLength - info.length;
  const rest = repeatSpace( lineSize % 2 );
  const space = repeatSpace( Math.floor( lineSize / 2 ) );
  return space + info + space + rest;
};

const setProgress = ( line, index ) =>
  line.split( '' ).map( ( l, i ) => ( i === index ) ? vars.bg.white + l : l ).join( '' );

const printProgress = line => {
  clearCurrentLine();
  process.stdout.write( vars.fg.black + vars.bg.green + line + vars.reset );
};

module.exports = {
  init( size ) {
    let done = 0;

    console.log( 'Running tests...' );

    if ( !isCI() ) {
      printProgress( setProgress( createLine( 0 ), 0 ) );
    }

    return {
      update( ) {
        done++;
        const progress = done / size;
        const progressIndex = Math.ceil( maxLength * progress );
        const roundProgress = ( progress * 100 ).toFixed( 2 );

        if ( isCI() ) {
          console.log( `${roundProgress}%` );
        } else {
          printProgress( setProgress( createLine( roundProgress ), progressIndex ) );
        }

        if ( progress >= 1 ) {
          console.log();
          console.log();
        }
      }
    };
  }
};
