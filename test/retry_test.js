const IntegrationTestFw = require( '../core/index.js' );

IntegrationTestFw.run( {
  testsDir: 'retry_test',
  retries: 3
} );
