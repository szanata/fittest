const executeRunnable = require( './execute_runnable' );
const Fittest = require( '../models/fittest' );
const Test = require( '../models/test' );
const TestInterface = require( '../models/test_interface' );

const executeHooks = async ( hooks, timeoutTime, ...args ) => {
  for ( const hook of hooks ) {
    await executeRunnable( hook, timeoutTime, ...args );
    if ( !hook.result.ok ) { return false; }
  }
  return true;
};

const executeSteps = async ( steps, timeoutTime, ...args ) => {
  for ( const step of steps ) {
    await executeHooks( step.beforeHooks, timeoutTime, ...args );

    if ( step.result.ok ) {
      await executeRunnable( step.main, timeoutTime, ...args );
    }

    await executeHooks( step.afterHooks, timeoutTime, ...args );

    if ( !step.result.ok ) { return false; }
  }
  return true;
};

const executeUndoSteps = async ( steps, timeoutTime, ...args ) => {
  for ( const step of steps ) {
    const ok = await executeRunnable( step.undoHook, timeoutTime, ...args );
    if ( !ok ) { return false; }
  }
  return true;
};

module.exports = async ( file, timeoutTime, testCtx, testEnv ) => {
  const test = Test.init( file );
  const testInterface = TestInterface.init( testEnv, test );
  const fittest = Fittest.init( testInterface, test );

  global.fittest = fittest;
  try {
    require( file ); // eslint-disable-line global-require
  } catch ( err ) {
    test.err = err;
    return test;
  }

  if ( test.steps.length === 0 ) {
    return test;
  }

  test.invoked = true;

  const beforeHooksOk = await executeHooks( test.beforeHooks, timeoutTime, testCtx );

  if ( beforeHooksOk ) {
    await executeSteps( test.steps, timeoutTime, testCtx );
    await executeUndoSteps( test.undoSteps, timeoutTime, testCtx );
  }

  await executeHooks( test.afterHooks, timeoutTime, testCtx );

  return test;
};
