const vars = require( '../utils/console/std_vars' );
const isCI = require( '../utils/environment/is_ci' );

/*
▐▛▀▘▐▌▝▜▛▘▝▜▛▘▐▛▀▘▐▛▀▘▝▜▛▘
▐▛▀ ▐▌ ▐▌  ▐▌ ▐▛▀  ▀▄  ▐▌
▐▌  ▐▌ ▐▌  ▐▌ ▐▙▄▖▗▄▟▌ ▐▌
*/

module.exports = pack => {

  if ( isCI() ) {
    console.log( 'Fittest' );
  } else {
    const c1 = vars.dim + vars.fg.cyan;
    const c2 = vars.reset + vars.fg.cyan;
    const c3 = vars.reset + vars.bright + vars.fg.cyan;
    console.log( `${c1}▐▛▀▀ ▐▌ ▀▜▛▀ ▀▜▛▀ ▐▛▀▀ ▐▛▀▀ ▀▜▛▀` );
    console.log( `${c2}▐▛▀▘ ▐▌  ▐▌   ▐▌  ▐▛▀▘ ▝▀▀█  ▐▌` );
    console.log( `${c3}▐▌   ▐▌  ▐▌   ▐▌  ▐▙▄▄ ▗▄▄█  ▐▌` );
    process.stdout.write( vars.reset );
  }

  console.log();
  console.log( `version: ${pack.version}` );
  console.log();
};
