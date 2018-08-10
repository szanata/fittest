const createTestProcess = require( './create_test_process' );
const os = require( 'os' );
const threshold = os.cpus().length + 1;

module.exports = ( paths, emitter, featuresEnv, opts ) => new Promise( resolve => {
  const results = [];
  const startTime = Date.now();
  const tasksCount = paths.length;
  const testsPaths = paths.slice();
  const getEllapsedTime = () => Date.now() - startTime;
  const Counters = { running: 0, done: 0 };

  const testsLoop = setInterval( async () => {
    if ( tasksCount === Counters.done && Counters.running === 0 ) {
      clearInterval( testsLoop );
      resolve( { results, ellapsedTime: getEllapsedTime() } );
    }

    // no more tests. Await
    if ( testsPaths.length === 0 ) { return; }

    // if there is room, spin another process
    if ( Counters.running <= threshold ) {
      Counters.running++;
      const result = await createTestProcess( testsPaths.pop(), emitter, featuresEnv, opts );
      Counters.running--;
      Counters.done++;
      emitter.emit( 'single_test_completed', Counters.done );
      results.push( result );
    }
  }, 100 );
} );
