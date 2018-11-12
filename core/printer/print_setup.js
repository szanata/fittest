const padBetween = require( '../utils/console/print/pad_between' );
const bc = require( '../utils/console/box_chars' );
const repeatChar = require( '../utils/console/print/repeat_char' );
const msToS = require( '../utils/time/ms_to_s' );

module.exports = fwEnv => {

  const info = [];
  info.push( `Tests: ${fwEnv.testsPaths.length}` );
  if ( fwEnv.blockPaths.beforeAll ) {
    info.push( 'Before All Block: true' );
  }
  if ( fwEnv.blockPaths.afterAll ) {
    info.push( 'After All Block: true' );
  }

  info.push( `Timeout: ${msToS( fwEnv.timeoutTime )}s` );
  info.push( `Directory: ${fwEnv.relativeDir}` );
  info.push( `Retries: ${fwEnv.retries}` );

  const length = info.slice().sort( ( a, b ) => b.length - a.length )[0].length + 4;
  const bar = repeatChar( length - 2, bc.box.thin.h );
  const separator = bc.box.thin.conn.l +
    repeatChar( length - 2, bc.box.thin.h ) +
    bc.box.thin.conn.r;

  console.log( `${bc.extras.round.cnr.tl}${bar}${bc.extras.round.cnr.tr} ` );
  console.log( padBetween( `${bc.box.thin.v} Tests setup`, ` ${bc.box.thin.v}`, length, ' ' ) );
  console.log( separator );
  info.map( c =>
    padBetween( `${bc.box.thin.v} ${c}`, ` ${bc.box.thin.v}`, length, ' ' )
  ).forEach( c => console.log( c ) );
  console.log( `${bc.extras.round.cnr.bl}${bar}${bc.extras.round.cnr.br} ` );
  console.log( );
};
