const logger = require( '../logger' ).createBufferLogger();
const runTest = require( './run_test' );
const createEventInterface = require( './create_event_interface' );

const [ , , testPath, processId, extras ] = process.argv;
const { serverUrl } = JSON.parse( extras );

let test;
try {
  test = require( testPath );
} catch ( err ) {
  logger.error( err.message, err.stack );
  process.send( { testPath, pass: false, logs: logger.output } );
  process.exit( 1 );
}

const event = createEventInterface( );

const env = { serverUrl: `${serverUrl}/${processId}`, asyncEvent: event.on };

process.on( 'message', m => event.emit( m.eventName, m.args ) );

runTest( test, env, logger ).then( pass => process.send( { testPath, pass, logs: logger.output } ) );
