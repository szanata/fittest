const { fork } = require( 'child_process' );
const path = require( 'path' );

module.exports = ( testPath, emitter, featuresEnv, opts ) => {
  const id = String( Math.ceil( Math.random() * 1000 ) );
  const runnerPath = path.join( __dirname, './runner/index.js' );
  const parameters = [ JSON.stringify( { testPath, id, featuresEnv, opts } ) ];
  const options = { stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ] };
  const listenEvent = `message_to:${id}`;
  const proc = fork( runnerPath, parameters, options );

  const messageHandler = ( { name, args } ) => {
    setTimeout( () => proc.send( { name, args } ), 1000 );
  };

  emitter.on( listenEvent, messageHandler );

  proc.stdout.on( 'data', data => {
    console.log( Buffer.from( data ).toString() );
  } );

  proc.stderr.on( 'data', data => {
    console.error( Buffer.from( data ).toString() );
  } );

  return new Promise( resolve => {
    proc.on( 'message', result => {
      emitter.removeListener( listenEvent, messageHandler );
      resolve( result );
    } );
  } );
};