const { join } = require( 'path' );
const { writeFileSync, existsSync, unlinkSync } = require( 'fs' );

fittest( 'Retry test context', test => {
  test.step( 'Should never share context between test retries', ctx => {
    const cfile = join( __dirname, '_control_context' );
    const isRetry = existsSync( cfile );

    if ( !isRetry ) {
      ctx.set( 'context_var', true );
      writeFileSync( cfile, '' );
      throw new Error( 'Triggering a retry' );
    }

    unlinkSync( cfile );

    if ( ctx.get( 'context_var' ) ) {
      throw new Error( 'Retries should not have context variables set' );
    }
  } );
} );
