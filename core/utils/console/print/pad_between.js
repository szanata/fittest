module.exports = ( start, end, size, char ) =>{
  const length = size - start.length - end.length;
  if ( length < 0 ) {
    return ( start + end ).slice( 0, size );
  }
  return start + Array( length + 1 ).join( char ) + end;
};
