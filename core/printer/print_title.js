const bc = require( '../utils/console/box_chars' );

module.exports = label => {
  const line = Array( label.length + 2 ).fill( bc.box.thin.h ).join( '' );
  console.log( `${bc.extras.round.cnr.tl}${line}${bc.extras.round.cnr.tr} ` );
  console.log( `${bc.box.thin.v} ${label} ${bc.box.thin.v}` );
  console.log( `${bc.extras.round.cnr.bl}${line}${bc.extras.round.cnr.br} ` );
};
