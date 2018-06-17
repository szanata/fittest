const { readdirSync } = require( 'fs' );
const { join } = require( 'path' );

module.exports = source => readdirSync( source )
  .map( name => join( source, name ) )
  .map( dir => require( dir ) ); // eslint-disable-line global-require, import/no-dynamic-require

