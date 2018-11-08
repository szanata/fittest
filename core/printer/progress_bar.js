const maxLength = 40;
const vars = require( '../utils/console/std_vars' );
const { printSpace } = require( './tools' );

const clearCurrentLine = () => {
  process.stdout.clearLine();
  process.stdout.cursorTo( 0 );
};

const createLine = number => {
  const info = `${number}%`;
  const lineSize = maxLength - info.length;
  const rest = printSpace( lineSize % 2 );
  const space = printSpace( Math.floor( lineSize / 2 ) );
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

    printProgress( setProgress( createLine( 0 ), 0 ) );

    return {
      update( ) {
        done++;
        const progress = done / size;
        const progressIndex = Math.ceil( maxLength * progress );
        const humanProgress = ( progress * 100 ).toFixed( 2 );

        printProgress( setProgress( createLine( humanProgress ), progressIndex ) );

        if ( progress === 1 ) {
          console.log( '' );
        }
      }
    };
  }
};
