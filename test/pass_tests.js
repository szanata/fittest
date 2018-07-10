const IntegrationTestFw = require( '../core/index.js' );
const { join } = require( 'path' );

const testsDir = join( __dirname, './pass_tests' );

IntegrationTestFw.run( {
  testsDir,
  displaySuccessOutput: true
} );
