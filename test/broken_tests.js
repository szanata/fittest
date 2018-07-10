const IntegrationTestFw = require( '../core/index.js' );
const { join } = require( 'path' );

const testsDir = join( __dirname, './broken_tests' );

IntegrationTestFw.run( { testsDir, timeoutTime: 2000 } );
