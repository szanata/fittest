const IntegrationTestFw = require( '../index.js' );
const { join } = require( 'path' );

const testsDir = join( __dirname, './performance_tests' );

IntegrationTestFw.run( { testsDir } );
