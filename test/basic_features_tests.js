const IntegrationTestFw = require( '../core/index.js' );

IntegrationTestFw.run( {
  beforeAll: 'basic_features_tests/before_all',
  testsDir: 'basic_features_tests',
  afterAll: 'basic_features_tests/after_all',
} );
