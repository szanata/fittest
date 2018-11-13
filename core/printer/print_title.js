const bc = require( '../utils/console/box_chars' );
const repeatChar = require( '../utils/console/print/repeat_char' );

module.exports = title => {
  const top = bc.extras.round.cnr.tl + repeatChar( title.length + 2, bc.box.thin.h ) + bc.extras.round.cnr.tr;
  const bellowTitleBarSize = top.length - 2;
  const bottom = (
    bc.box.thin.conn.l +
    repeatChar( bellowTitleBarSize, bc.box.thin.h ) +
    bc.box.thin.conn.b
  ).padEnd( 79, bc.box.thin.h ) + bc.extras.round.cnr.tr;

  console.log( top );
  console.log( bc.box.thin.v + ` ${title} ` + bc.box.thin.v );
  console.log( bottom );
};


