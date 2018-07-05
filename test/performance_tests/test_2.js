const fs = require( 'fs' );
const path = require( 'path' );

module.exports = {

  exec( env, ctx, logger ) {
    let i = 0;
    do {
      fs.readFileSync( path.join( __dirname, 'test_2.js' ) );
      i++;
    } while ( i < 1000 );

    logger.ok( 'Slow task done' );
  }
};
