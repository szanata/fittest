const logger = require( './logger' ).createInternalLogger();
const { fork } = require( 'child_process' );
const path = require( 'path' );
const os = require( 'os' );

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
  const threshold = os.cpus().length + 1;
  const startTime = Date.now();
  const tasksCount = paths.length;
  const processesIndex = { };
  let running = 0;
  let completed = 0;

  logger.flow( `Running ${paths.length} tests` );

  emitter.on( 'message', ( { processId, eventName, args } ) => {
    setTimeout( () => { // small detail before trying to call the event
      if ( !processesIndex[processId] ) { return; }
      processesIndex[processId].send( { eventName, args } );
    }, 1000 );
  } );

  return new Promise( resolve => {
    logger.spinStart();
    setInterval( () => {
      if ( tasksCount === completed && running === 0 ) {
        logger.spinStop();
        const ellapsedTime = Date.now() - startTime;
        resolve( { results, ellapsedTime } );
      }

      // no more tests. Await
      if ( paths.length === 0 ) { return; }

      // if there is room, spin another process
      if ( running <= threshold ) {
        running++;
        const proc = createProcess( paths.pop(), featuresEnv, opts );
        proc.on( 'message', result => {
          running--;
          completed++;
          logger.ok( `Completed (${completed}/${tasksCount})` );
          results.push( result );
          delete processesIndex[proc.id];
        } );
        processesIndex[proc.id] = proc;
      }
    }, 100 );
  } );
};
