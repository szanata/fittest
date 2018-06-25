const loadTestPaths = require( './core/load_test_paths' );
const features = require( './core/features' );
const logger = require( './core/logger' ).createStdoutLogger();
const executeTests = require( './core/execute_tests' );
const EventEmitter = require( 'events' );

// const logResults = results => results
//   .reduce( ( logs, r ) => logs.concat( r.logs ), [] )
//   .forEach( line => console.log( line ) );

const hasAnyFalse = results => results.some( r => !r.pass );

module.exports = {

  async run( opts ) {
    let exitCode = 0;

    const emitter = new EventEmitter();

    try {
      const paths = loadTestPaths( opts.testsDir );

      const featuresEnv = await features.init( emitter );

      const results = await executeTests( paths, emitter, featuresEnv );

      results.forEach( result => {
        logger.flow( `Test result for ${result.testPath}` );
        result.logs.forEach( line => console.log( line ) );
      } );

      if ( hasAnyFalse( results ) ) {
        logger.fail( 'Tests failed. Exiting with 1.' );
        exitCode = 1;
      } else {
        logger.pass( 'All tests passed. Exiting with 0.' );
        exitCode = 0;
      }
    } catch ( err ) {
      logger.fail( 'Startup error' );
      console.error( err );
      exitCode = 1;
    }

    process.exit( exitCode );
  }
};

