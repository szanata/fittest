const { fork } = require( 'child_process' );
const path = require( 'path' );

module.exports = ( type, value, emitter, opts ) => {
  const id = String( Math.ceil( Math.random() * 1000 ) );
  const runnerPath = path.join( __dirname, './runner/index.js' );
  const parameters = [ JSON.stringify( { type, value, id, opts } ) ];
  const options = { stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ] };
  const listenEvent = `message_to:${id}`;
  const proc = fork( runnerPath, parameters, options );

  const messageHandler = ( { name, args } ) => {
    setTimeout( () => {
      try {
        proc.send( { name, args } );
      } catch ( err ) {
        // swallow this error. This happens when the proc already ended but there is still a message to be sent.
      }
    }, 3000 );
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