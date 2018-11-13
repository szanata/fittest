const { join } = require( 'path' );
const { writeFileSync, readFileSync, existsSync, unlinkSync } = require( 'fs' );

fittest( 'Retry tests', test => {
  test.step( 'Execute this block x times if it breaks', () => {
    const cfile = join( __dirname, '_control_basic' );

    const threshold = 3;
    const tries = existsSync( cfile ) ? parseInt( readFileSync ( cfile ) ) : 0;

    if ( tries < threshold ) {
      writeFileSync( cfile, String( tries + 1 ) );
      throw new Error( `Break ${tries + 1}` );
    }

    unlinkSync( cfile );
  } );
} );
