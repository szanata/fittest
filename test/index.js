const IntegrationTestFw = require( '../index.js' );
const { join } = require( 'path' );

const testsDir = join( __dirname, './tests' );

IntegrationTestFw.run( { 
  testsDir,
  displaySuccessOutput: true
} );
