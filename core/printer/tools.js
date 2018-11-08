module.exports = {
  printSpace: size => Array( size + 1 ).join( ' ' ),
  repeatChar: ( char, size ) => Array( size + 1 ).join( char ),
  repeatStart: ( start, size, char ) => start + Array( size + 1 - start.length ).join( char )
};
