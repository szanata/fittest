const fittest = require( '../core/index.js' );

fittest.run( {
  beforeAll: 'invalid_block_tests/before_all',
  testsDir: 'invalid_block_tests',
  timeoutTime: 10000
} );
