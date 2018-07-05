const loadTestPaths = require( './core/load_test_paths' );
const features = require( './core/features' );
const logger = require( './core/logger' ).createStdoutLogger();
const executeTests = require( './core/execute_tests' );
const EventEmitter = require( 'events' );

const hasAnyFalse = results => results.some( r => !r.pass );

const defaults = {
  displaySuccessOutput: false,
  timeoutTime: 300000
};

module.exports = {

  async run( opts ) {
    const execOpts = Object.assign( { }, defaults, opts );

    let exitCode = 0;

    const emitter = new EventEmitter();

    try {
      const paths = loadTestPaths( execOpts.testsDir );

      const featuresEnv = await features.init( emitter );

      const { results, ellapsedTime } = await executeTests( paths, emitter, featuresEnv, execOpts );

      results.forEach( result => {
        if ( !execOpts.displaySuccessOutput && result.pass ) {
          return;
        }
        logger.flow( `Test result for ${result.name}` );
        result.logs.forEach( line => console.log( line ) );
      } );

      const timeInSeconds = ( ellapsedTime / 1000 ).toFixed( 2 );

      if ( hasAnyFalse( results ) ) {
        logger.fail( `Tests failed. Total run time ${timeInSeconds}s.` );
        exitCode = 1;
      } else {
        logger.pass( `Tests passed. Total run time ${timeInSeconds}s.` );
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

