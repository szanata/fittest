const IntegrationTestFw = require( '../core/index.js' );

IntegrationTestFw.run( {
  beforeAll: 'block_test/before_all.js',
  path: 'block_test',
  afterAll: 'block_test/after_all.js'
} );
