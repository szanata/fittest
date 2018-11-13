const fittest = require( '../core/index.js' );

fittest.run( {
  beforeAll: 'basic_tests/before_all',
  testsDir: 'basic_tests',
  afterAll: 'basic_tests/after_all',
  timeoutTime: 10000
} );
