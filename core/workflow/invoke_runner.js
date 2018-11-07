const invoke = require( '../utils/process/invoke' );
const path = require( 'path' );
const runnerPath = path.join( __dirname, '../runner/index.js' );

module.exports = ( emitter, args ) => invoke( runnerPath, emitter, args );
