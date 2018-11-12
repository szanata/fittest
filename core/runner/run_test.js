const executeRunnable = require( './execute_runnable' );
const Fittest = require( '../models/fittest' );
const TestState = require( '../models/test_state' );
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
  const testState = TestState.init( file );
  const testInterface = TestInterface.init( testEnv, testState );
  const fittest = Fittest.init( testInterface, testState );

  global.fittest = fittest;
  try {
    require( file ); // eslint-disable-line global-require
  } catch ( err ) {
    testState.err = err;
    return testState;
  }

  if ( testState.steps.length === 0 ) {
    testState.flagNil();
    return testState;
  }

  const beforeHooksOk = await executeHooks( testState.beforeHooks, timeoutTime, testCtx );

  if ( beforeHooksOk ) {
    await executeSteps( testState.steps, timeoutTime, testCtx );
    await executeUndoSteps( testState.undoSteps, timeoutTime, testCtx );
  }

  await executeHooks( testState.afterHooks, timeoutTime, testCtx );

  return testState;
};
