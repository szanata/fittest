const invokeRunner = require( './invoke_runner' );
const { cpus } = require( 'os' );
const { RunnableTypes: { test: testType } } = require( '../models/types' );

const threshold = cpus().length + 1;

const createTasks = paths => paths.map( p =>( {
  testPath: p,
  retries: 0,
  done: false
} ) );

module.exports = ( fwResults, emitter, fwEnv ) => new Promise( resolve => {
  const tasks = createTasks( fwEnv.testsPaths );
  const tasksCount = tasks.length;

  const Counters = { running: 0, completed: 0 };

  const loop = setInterval( async () => {

    if ( tasksCount === Counters.completed && Counters.running === 0 ) {
      clearInterval( loop );
      resolve( fwResults );
    }

    // no more tests. Await
    if ( tasks.length === 0 ) { return; }

    // if there is room, spin another process
    if ( Counters.running <= threshold ) {

      Counters.running++;

      const task = tasks.pop();
      const args = {
        type: testType,
        filePath: task.testPath,
        fwEnv
      };
      const testState = await invokeRunner( emitter, args );

      testState.retries = task.retries;
      if ( !testState.ok && task.retries < fwEnv.retries ) {
        task.retries++;
        tasks.push( task );
      } else {
        emitter.emit( 'task_done' );
        Counters.completed++;
      }

      fwResults.addTestState( testState );
      Counters.running--;
    }
  }, 100 );
} );
