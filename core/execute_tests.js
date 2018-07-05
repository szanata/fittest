const logger = require( './logger' ).createStdoutLogger();
const { fork } = require( 'child_process' );
const path = require( 'path' );

const createProcess = ( testPath, featuresEnv, opts ) => {
  const runnerPath = path.join( __dirname, './runner/index.js' );
  const id = String( Math.ceil( Math.random() * 1000 ) );
  const parameters = [ JSON.stringify( { testPath, id, featuresEnv, opts } ) ];
  const options = {
    stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
  };

  const proc = fork( runnerPath, parameters, options );
  Reflect.set( proc, 'id', id );

  proc.stdout.on( 'data', data => {
    console.log( Buffer.from( data ).toString() );
  } );

  proc.stderr.on( 'data', data => {
    console.error( Buffer.from( data ).toString() );
  } );

  return proc;
};

module.exports = ( paths, emitter, featuresEnv, opts ) => {
  const results = [];
  let completed = 0;

  logger.flow( `Running ${paths.length} tests` );

  const startTime = Date.now();

  const testProcesses = paths.map( testPath => {
    const proc = createProcess( testPath, featuresEnv, opts );
    proc.on( 'message', result => {
      completed++;
      logger.ok( `Completed (${completed}/${paths.length})` );
      results.push( result );
    } );
    return proc;
  } );

  emitter.on( 'message', ( { processId, eventName, args } ) => {
    testProcesses.forEach( process => {
      if ( process.id === processId ) {
        process.send( { eventName, args } );
      }
    } );
  } );

  return new Promise( resolve => {
    logger.spinStart();
    setInterval( () => {
      if ( results.length === testProcesses.length ) {
        logger.spinStop();
        const ellapsedTime = Date.now() - startTime;
        resolve( { results, ellapsedTime } );
      }
    }, 100 );
  } );
};
