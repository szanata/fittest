const { repeatBothEnds, repeatChar } = require( './tools' );
const bc = require( '../utils/console/box_chars' );
const msToS = require( '../utils/time/ms_to_s' );

module.exports = fwResults => {
  const result = fwResults.testsResult;
  const info = [];
  info.push( `Tests: ${fwResults.states.tests.length}` );
  info.push( `Total time: ${msToS( result.et )} seconds` );
  info.push( `Result: ${result.ok ? 'passed' : 'broken'}` );

  const length = info.slice().sort( ( a, b ) => a.length < b.length )[0].length + 4;
  const bar = repeatChar( length - 2, bc.box.thin.h );
  const separator = bc.box.thin.conn.l +
    repeatChar( length - 2, bc.box.thin.h ) +
    bc.box.thin.conn.r;

  console.log( `${bc.extras.round.cnr.tl}${bar}${bc.extras.round.cnr.tr} ` );
  console.log( repeatBothEnds( `${bc.box.thin.v} Results`, ` ${bc.box.thin.v}`, length, ' ' ) );
  console.log( separator );
  info.map( content =>
    repeatBothEnds( `${bc.box.thin.v} ${content}`, ` ${bc.box.thin.v}`, length, ' ' )
  ).forEach( c => console.log( c ) );
  console.log( `${bc.extras.round.cnr.bl}${bar}${bc.extras.round.cnr.br} ` );
  console.log( );
};
