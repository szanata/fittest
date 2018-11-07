const Fittest = require( '../models/fittest' );
const TestState = require( '../models/test_state' );
const TestInterface = require( '../models/test_public_interface' );
const TimeoutKiller = require( '../utils/time/timeout_killer' );

const executeTestBit = require( './execute_test_bit' );

const executeHooks = async ( hooks, ...args ) => {
  for ( const hook of hooks ) {
    await executeTestBit( hook, ...args );
    if ( !hook.ok ) { return false; }
  }
  return true;
};

const executeSteps = async ( steps, ...args ) => {
  for ( const step of steps ) {
    await executeHooks( step.beforeHooks, ...args );

    if ( step.ok ) {
      await executeTestBit( step, ...args );
    }

    await executeHooks( step.afterHooks, ...args );

    if ( !step.ok ) { return false; }
  }
  return true;
};

const executeUndoSteps = async ( steps, ...args ) => {
  for ( const step of steps ) {
    const ok = await executeTestBit( step.undoHook, ...args );
    if ( !ok ) { return false; }
  }
  return true;
};

module.exports = async ( file, fwEnv, testCtx, testEnv ) => {
  const testState = TestState.init( file );
  const testInterface = TestInterface.init( testEnv, testState );
  const fittest = Fittest.init( testInterface, testState );

  TimeoutKiller.init( fwEnv.timeoutTime );

  global.fittest = fittest;
  require( file ); // eslint-disable-line global-require

  const beforeHooksOk = await executeHooks( testState.beforeHooks, testCtx );

  if ( beforeHooksOk ) {
    await executeSteps( testState.steps, testCtx );
    await executeUndoSteps( testState.undoSteps, testCtx );
  }

  await executeHooks( testState.afterHooks, testCtx );

  TimeoutKiller.stop();
  return testState;
};
