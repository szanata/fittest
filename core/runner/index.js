const logger = require( '../logger' ).createBufferLogger();
const runTest = require( './run_test' );
const createEventInterface = require( './create_event_interface' );
const getTestName = require( '../get_test_name' );

const [ , , args ] = process.argv;
const { testPath, id, opts, featuresEnv: { serverUrl } } = JSON.parse( args );
const name = getTestName( testPath );

let test;
try {
  test = require( testPath );
} catch ( err ) {
  logger.error( err.message, err.stack );
  process.send( { name, pass: false, logs: logger.output } );
  process.exit( 1 );
}

const event = createEventInterface( );

const env = { serverUrl: `${serverUrl}/${id}`, asyncEvent: event.on };

process.on( 'message', m => event.emit( m.eventName, m.args ) );

runTest( name, test, env, logger, opts ).then( pass => process.send( { name, pass, logs: logger.output } ) );
