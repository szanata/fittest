const vars = require( '../utils/console/std_vars' );

module.exports = pack => {
  // console.log( '▐▛▀▘▐▌▝▜▛▘▝▜▛▘▐▛▀▘▐▛▀▘▝▜▛▘' );
  // console.log( '▐▛▀ ▐▌ ▐▌  ▐▌ ▐▛▀  ▀▄  ▐▌' );
  // console.log( '▐▌  ▐▌ ▐▌  ▐▌ ▐▙▄▖▗▄▟▌ ▐▌' );

  process.stdout.write( vars.fg.cyan );
  console.log( '▐▛▀▀ ▐▌ ▀▜▛▀ ▀▜▛▀ ▐▛▀▀ ▐▛▀▀ ▀▜▛▀' );
  console.log( '▐▛▀▘ ▐▌  ▐▌   ▐▌  ▐▛▀▘ ▝▀▀█  ▐▌' );
  console.log( '▐▌   ▐▌  ▐▌   ▐▌  ▐▙▄▄ ▗▄▄█  ▐▌' );
  process.stdout.write( vars.reset );

  console.log();
  console.log( `version: ${pack.version}` );
  console.log();
  console.log( 'Starting environment...' );
  console.log();
};
