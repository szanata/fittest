const runTest = require( './run_test' );
const runBlock = require( './run_block' );
const CustomEventEmitter = require( '../utils/events/custom_event_emitter' );
const deserializeMap = require( '../utils/object/deserialize_map' );
const createTestEnv = require( './create_test_env' );
// const serializeMap = require( '../utils/object/serialize_map' );

// const { overwriteConsole } = require( '../logger' );

// overwriteConsole( );

const [ , , args ] = process.argv;
const { id, args: { type, filePath, fwEnv } } = JSON.parse( args );

const emitter = CustomEventEmitter.init( );

// register one way message receiver from main process
process.on( 'message', m => emitter.emit( m.name, m.args ) );

const testCtx = deserializeMap( fwEnv.context );
const testEnv = createTestEnv( fwEnv, id, emitter );

( async () =>
  ( type === 'test' ? runTest : runBlock )( filePath, fwEnv, testCtx, testEnv )
)().then( testState => {
  process.send( testState.serialize() );
  process.exit( 0 );
} );
