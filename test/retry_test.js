const IntegrationTestFw = require( '../core/index.js' );

IntegrationTestFw.run( { path: 'retry_test', displaySuccessOutput: true, retries: 1 } );
