const logger = require( '../logger' ).createUserLogger();
const invokeTestPhases = require( './invoke_test_phases' );
const createEventInterface = require( './create_event_interface' );
const testNameResolver = require( './test_name_resolver' );

const [ , , args ] = process.argv;
const { testPath, id, opts, featuresEnv: { serverUrl } } = JSON.parse( args );

const name = testNameResolver( testPath );

let test;

try {
  test = require( testPath ); // eslint-disable-line global-require
} catch ( err ) {
  logger.error( err.message, err.stack );
  process.send( { name, pass: false, logs: logger.output } );
  process.exit( 1 );
}

const event = createEventInterface( );

const env = { serverUrl: `${serverUrl}/${id}`, asyncEvent: event.once };

process.on( 'message', m => event.emit( m.name, m.args ) );

const invokeTest = async ( retriesCount = 0 ) => {
  const pass = await invokeTestPhases( name, test, env, logger, opts );
  if ( !pass && retriesCount < opts.retries ) {
    logger.warn( 'Retrying test...' );
    invokeTest( retriesCount + 1 );
  } else {
    process.send( { name, pass, logs: logger.output } );
  }
};

invokeTest();
