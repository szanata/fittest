const { readdirSync, lstatSync, existsSync } = require( 'fs' );
const { join } = require( 'path' );

const readFiles = src =>
  readdirSync( src ).reduce( ( arr, fName ) => {
    const path = join( src, fName );

    if ( lstatSync( path ).isDirectory() ) {
      return arr.concat( readFiles( path ) ) ;
    }

    if ( path.endsWith( '_test/index.js' ) || path.endsWith( '.test.js' ) ) {
      return arr.concat( path );
    }

    return arr;
  }, [] );

module.exports = ( dirname, src ) => {
  const path = join( dirname, src );
  if ( !existsSync( path ) ) {
    if ( !path.endsWith( '.js' ) ) {
      const file = path + '.js';
      if ( existsSync( file ) && lstatSync( file ).isFile() ) {
        return [ file ];
      }
    }
  } else {
    if ( lstatSync( path ).isFile() ) {
      return [ path ];
    } else {
      return readFiles( path );
    }
  }

  throw new Error( `Could not load "${path}".` );
};
