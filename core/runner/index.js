const runTest = require( './run_test' );
const runBlock = require( './run_block' );
const CustomEventEmitter = require( '../utils/events/custom_event_emitter' );
const deserializeMap = require( '../utils/object/deserialize_map' );
const createTestEnv = require( './create_test_env' );
const consoleSuppressor = require( '../utils/console/suppressor' );

// console.flush = () => {};
consoleSuppressor.init();

const [ , , args ] = process.argv;
const { id, args: { type, filePath, fwEnv } } = JSON.parse( args );

const emitter = CustomEventEmitter.init( );

// register one way message receiver from main process
process.on( 'message', m => emitter.emit( m.name, m.args ) );

const testCtx = deserializeMap( fwEnv.context );
const testEnv = createTestEnv( fwEnv, id, emitter );
const timeoutTime = fwEnv.timeoutTime;

( () =>
  ( type === 'test' ? runTest : runBlock )( filePath, timeoutTime, testCtx, testEnv )
)().then( state => {
  process.send( state ? state.serialize() : null );
  process.exit( 0 );
} ).catch( err => {
  console.log( err );
  process.exit( 1 );
} );
