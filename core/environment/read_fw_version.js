const { readFileSync } = require( 'fs' );
const { join } = require( 'path' );
module.exports = () => JSON.parse( readFileSync( join( __dirname, '..', '..', 'package.json' ) ) ).version;
