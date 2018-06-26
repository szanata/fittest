const IntegrationTestFw = require( '../index.js' );
const { join } = require( 'path' );

const testsDir = join( __dirname, './error_tests' );

IntegrationTestFw.run( { testsDir, timeoutTime: 2000 } );
