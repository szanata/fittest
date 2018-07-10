const { readdirSync } = require( 'fs' );
const { join } = require( 'path' );

module.exports = source => readdirSync( source )
  .filter( name => name.endsWith( '.js' ) || !name.includes( '.' ) )
  .map( name => join( source, name ) );

