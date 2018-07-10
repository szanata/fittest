const logger = require( '../logger' ).createExposedLogger();
const invokeTestPhases = require( './invoke_test_phases' );
const createEventInterface = require( './create_event_interface' );
const testNameResolver = require( './test_name_resolver' );

const [ , , args ] = process.argv;
const { testPath, id, opts, featuresEnv: { serverUrl } } = JSON.parse( args );

const name = testNameResolver( testPath );

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

invokeTestPhases( name, test, env, logger, opts )
  .then( pass => process.send( { name, pass, logs: logger.output } ) );
