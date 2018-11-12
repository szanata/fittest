const { join } = require( 'path' );
const { writeFileSync, readFileSync, existsSync, unlinkSync } = require( 'fs' );

fittest( 'Retry tests', test => {
  test.step( 'Execute this block x times if it breaks', ctx => {
    const cfile = join( __dirname, '_control' );

    const threshold = 3;
    const tries = existsSync( cfile ) ? parseInt( readFileSync ( cfile ) ) : 0;

    if ( tries < 3 ) {
      writeFileSync( cfile, String( tries + 1 ) );
      throw new Error( `Break ${tries + 1}` );
    }

    unlinkSync( cfile );

    // if ( existsSync( controlFile1 ) ) {
    //   if ( ctx.get( 'previous_var' ) ) {
    //     throw new Error( 'Context vars from previous run should not be persisted' );
    //   }
    //   unlinkSync( controlFile1 );
    // } else if ( existsSync( controlFile2 ) ) {

    //   unlinkSync( controlFile2 );
    // } else {
    //   ctx.set( 'previous_var', 'bar' );
    //   writeFileSync( controlFile, `Task failed on ${new Date().toString()}` );
    //   throw new Error( 'Failing this test on purpose.' );
    // }
  } );
} );
