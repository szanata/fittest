const { join } = require( 'path' );
const { writeFileSync, existsSync, unlinkSync, readFileSync } = require( 'fs' );

module.exports = {

  async exec( env, ctx, logger ) {
    const controlFile = join( __dirname, 'runonce' );
    if ( existsSync( controlFile ) ) {
      const content = readFileSync( controlFile );
      logger.info( 'Control file content', Buffer.from( content, 'utf-8' ).toString() );
      logger.ok( 'Retry was a blast!' );
      unlinkSync( controlFile );
    } else {
      writeFileSync( controlFile, `Task failed on ${new Date().toString()}` );
      console.log( 'Failing' );
      throw new Error( 'Failing this test on purpose.' );
    }
  }
};
