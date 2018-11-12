module.exports = size => ( size < 0 ) ?
  '' :
  Array( size + 1 ).join( ' ' );
