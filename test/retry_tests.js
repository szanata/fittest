const fittest = require( '../core/index.js' );

fittest.run( {
  testsDir: 'retry_test',
  retries: 3
} );
