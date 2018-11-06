const invokeTest = require( './invoke_test' );
const CustomEventEmitter = require( '../utils/events/custom_event_emitter' );
const createEnvironment = require( './create_environment' );
// const serializeMap = require( '../utils/object/serialize_map' );
const deserializeMap = require( '../utils/object/deserialize_map' );
// const { overwriteConsole } = require( '../logger' );

// overwriteConsole( );

const [ , , args ] = process.argv;
const { type, filePath, id, opts } = JSON.parse( args );

const emitter = CustomEventEmitter.init( );
const env = createEnvironment( id, opts, emitter );
const ctx = deserializeMap( opts.context );

// register one way message receiver from main process
process.on( 'message', m => emitter.emit( m.name, m.args ) );

let exec = () => {};

if ( type === 'test' ) {
  exec = async ( retriesCount = 0 ) => {
    const testState = await invokeTest( filePath, ctx, env, opts.timeoutTime );
    if ( !testState.ok && retriesCount < opts.retries ) {
      console.warn( 'Retrying test...' );
      return exec( retriesCount + 1 );
    } else {
      return testState;
    }
  };

} else if ( type === 'block' ) {
  // exec = () => invokeBlock( filePath, ctx, env, opts.timeoutTime );
}

exec().then( testState => {
  process.send( testState.serialize() );
  process.exit( 0 );
} );
