const IntegrationTestFw = require( '../core/index.js' );

IntegrationTestFw.run( {
  beforeAll: 'basic_tests/before_all',
  testsDir: 'basic_tests',
  afterAll: 'basic_tests/after_all'
} );
