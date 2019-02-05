const padBetween = require( '../utils/console/print/pad_between' );
const bc = require( '../utils/console/box_chars' );
const repeatChar = require( '../utils/console/print/repeat_char' );
const toHuman = require( '../utils/time/to_human' );
const msToS = require( '../utils/time/ms_to_s' );

module.exports = fwResults => {
  console.log();

  const info = [];

  const statistics = fwResults.consolidateStatistics();

  info.push( `Tests: ${fwResults.states.tests.length}` );
  info.push( `Total time: ${toHuman( fwResults.et )}` );
  info.push( `Result: ${fwResults.ok ? 'passed' : 'broken'}` );
  info.push( `Tests mean time: ${msToS( statistics.tests.std )}s` );
  info.push( `Steps mean time: ${msToS( statistics.steps.std )}s` );

  const length = info.slice().sort( ( a, b ) => b.length - a.length )[0].length + 4;
  const bar = repeatChar( length - 2, bc.box.thin.h );
  const separator = bc.box.thin.conn.l +
    repeatChar( length - 2, bc.box.thin.h ) +
    bc.box.thin.conn.r;

  console.log( `${bc.extras.round.cnr.tl}${bar}${bc.extras.round.cnr.tr} ` );
  console.log( padBetween( `${bc.box.thin.v} Results`, ` ${bc.box.thin.v}`, length, ' ' ) );
  console.log( separator );
  info.map( content =>
    padBetween( `${bc.box.thin.v} ${content}`, ` ${bc.box.thin.v}`, length, ' ' )
  ).forEach( c => console.log( c ) );
  console.log( `${bc.extras.round.cnr.bl}${bar}${bc.extras.round.cnr.br} ` );
  console.log( );
};
