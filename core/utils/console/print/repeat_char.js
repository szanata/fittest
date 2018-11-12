module.exports = ( size, char ) => {
  const length = size + 1;
  return length < 0 ? '' : Array( length ).join( char );
};
