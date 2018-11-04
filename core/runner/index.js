const logger = require( '../logger' ).createUserLogger();
const invokeTestPhases = require( './invoke_test_phases' );
const CustomEventEmitter = require( '../utils/event/custom_event_emitter' );
const testNameResolver = require( './test_name_resolver' );
const createEnvironment = require( './create_environment' );
const ExecResult = require( '../models/exec_result' );
const Timer = require( '../utils/time/timer' );
const serializeMap = require( '../object/serialize_map' );
const deserializeMap = require( '../object/deserialize_map' );

const [ , , args ] = process.argv;
const { type, value, id, opts } = JSON.parse( args );

const emitter = CustomEventEmitter.init( );
const env = createEnvironment( id, opts, emitter );
const timer = Timer.start();

process.on( 'message', m => emitter.emit( m.name, m.args ) );

const ctx = deserializeMap( opts.context );
const name = testNameResolver( value );

let content;

try {
  content = require( value ); // eslint-disable-line global-require
} catch ( err ) {
  logger.error( err.message, err.stack );
  process.send( ExecResult.init( { name, pass: false, logs: logger.output, elapsedTime: timer.stop() } ) );
  process.exit( 1 );
}

let exec = () => {};

if ( type === 'test' ) {
  exec = async ( retriesCount = 0 ) => {
    const pass = await invokeTestPhases( name, content, env, new Map( ctx ), logger, opts );
    if ( !pass && retriesCount < opts.retries ) {
      logger.warn( 'Retrying test...' );
      return exec( retriesCount + 1 );
    } else {
      return { pass, logs: logger.output, elapsedTime: timer.stop() };
    }
  };

} else if ( type === 'block' ) {
  exec = async () => {
    let pass = true;
    try {
      await content.call( null, env, ctx, logger );
    } catch ( err ) {
      pass = false;
      logger.error( err.message );
    }
    return { pass, logs: logger.output, elapsedTime: timer.stop(), context: serializeMap( ctx ) };
  };
}

exec().then( result => {
  process.send( ExecResult.init( Object.assign( { name }, result ) ) );
  process.exit( 0 );
} );
