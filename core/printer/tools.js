const bc = require( '../utils/console/box_chars' );

const repeatChar = ( size, char ) => {
  const length = size + 1;
  return length < 0 ? '' : Array( length ).join( char );
};

module.exports = {
  printSpace: size => Array( size + 1 ).join( ' ' ),
  repeatChar,
  repeatStart( start, size, char ) {
    const length = size - start.length;
    if ( length < 0 ) {
      return start.slice( 0, size );
    }
    return start + repeatChar( length, char );
  },
  repeatBothEnds( start, end, size, char ) {
    const length = size - start.length - end.length;
    if ( length < 0 ) {
      return ( start + end ).slice( 0, size );
    }
    return start + repeatChar( length, char ) + end;
  },
  printTitle( label ) {
    const line = Array( label.length + 2 ).fill( bc.box.thin.h ).join( '' );
    console.log( `${bc.extras.round.cnr.tl}${line}${bc.extras.round.cnr.tr} ` );
    console.log( `${bc.box.thin.v} ${label} ${bc.box.thin.v}` );
    console.log( `${bc.extras.round.cnr.bl}${line}${bc.extras.round.cnr.br} ` );
  }
};
