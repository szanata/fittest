const { readdirSync, lstatSync } = require( 'fs' );
const { join } = require( 'path' );

const readFiles = src =>
  readdirSync( src ).reduce( ( arr, fName ) => {
    const path = join( src, fName );
    const stat = lstatSync( path );

    if ( stat.isDirectory() ) {
      return arr.concat( readFiles( path ) ) ;
    }

    if ( path.endsWith( '_test/index.js' ) || path.endsWith( '.test.js' ) ) {
      return arr.concat( path );
    }

    return arr;
  }, [] );

module.exports = ( dirname, src ) => {
  const path = join( dirname, src );
  if ( lstatSync( path ).isFile() ) { // single file mode
    return [ path ];
  }
  return readFiles( path );
};
