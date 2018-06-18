const createLogger = require( './core/create_logger' );
const createLocalServer = require( './core/create_local_server' );
const createEventEmitter = require( './core/create_event_emitter' );
const createNgrok = require( './core/create_ngrok' );
const createRunnableTest = require( './core/create_runnable_test' );
const bindEventRouter = require( './core/bind_event_router' );
const runTests = require( './core/parallel_runner' );
const loadTests = require( './core/load_test_files' );
const EventEmitter = require( 'events' );

const flushLogger = logger => logger.stack.forEach( t => console.log( t ) );

const hasAnyFalse = arr => arr.some( r => !r );

const createRunnableTests = ( tests, serverUrl, emitters, loggers ) => tests.map( ( test, i ) => {
  const emitter = emitters[i];
  const logger = loggers[i];
  const env = { serverUrl: `${serverUrl}/${emitter.id}`, asyncEvent: emitter.on };
  return createRunnableTest( test, env, logger );
} );

const createLoggers = tests => tests.map( () => createLogger() );

const createEventEmitters = tests => tests.map( () => createEventEmitter() );

module.exports = {

  async run( opts ) {
    let exitCode = 0;
    const mainLogger = createLogger();
    const mainEmitter = new EventEmitter();

    try {
      const tests = loadTests( opts.testsDir );

      const server = await createLocalServer( 9333, mainEmitter );
      const serverUrl = await createNgrok( server.address().port );
      const loggers = createLoggers( tests );
      const emitters = createEventEmitters( tests );
      const runnableTests = await createRunnableTests( tests, serverUrl, emitters, loggers );

      bindEventRouter( mainEmitter, emitters );

      const results = await runTests( runnableTests );

      if ( hasAnyFalse( results ) ) {
        mainLogger.fail( 'Tests failed. Exiting with 1.' );
        exitCode = 1;
      } else {
        mainLogger.pass( 'All tests passed. Exiting with 0.' );
        exitCode = 0;
      }

      loggers.forEach( flushLogger );
    } catch ( err ) {
      mainLogger.fail( 'Startup error' );
      console.error( err );
      exitCode = 1;
    }

    flushLogger( mainLogger );

    process.exit( exitCode );
  }
};

