const { readdirSync } = require( 'fs' );
const { join } = require( 'path' );

module.exports = source => readdirSync( source ).map( name => join( source, name ) );

