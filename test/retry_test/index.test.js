const { join } = require( 'path' );
const { writeFileSync, existsSync, unlinkSync, readFileSync } = require( 'fs' );

module.exports = {

  async exec( env, ctx, logger ) {
    const controlFile = join( __dirname, 'runonce' );
    if ( existsSync( controlFile ) ) {
      const content = readFileSync( controlFile );
      logger.info( 'Control file content', Buffer.from( content, 'utf-8' ).toString() );
      if ( ctx.get( 'previous_var' ) ) {
        throw new Error( 'Context vars from previous run should not be persisted' );
      }
      logger.ok( 'Retry was a blast!' );
      unlinkSync( controlFile );
    } else {
      ctx.set( 'previous_var', 'bar' );
      writeFileSync( controlFile, `Task failed on ${new Date().toString()}` );
      console.log( 'Failing' );
      throw new Error( 'Failing this test on purpose.' );
    }
  }
};
