const fittest = require( '../core/index.js' );

fittest.run( {
  beforeAll: 'isolation_test/before_all',
  testsDir: 'isolation_test',
  timeoutTime: 10000,
  eventTimeoutTime: 5000
} );
