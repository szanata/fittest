const Fittest = require( '../models/fittest' );
const TestState = require( '../models/test_state' );
const TestInterface = require( '../models/test_public_interface' );
const FnExecResult = require( '../models/fn_exec_result' );

const TimeoutError = require( '../models/timeout_error' );
const Timer = require( '../utils/time/timer' );

const fiveMinutes = 300000;
const execute = async ( fn, ...args ) => {
  const t = Timer.init();
  const result = FnExecResult.init();
  try {
    await fn( ...args );
  } catch ( err ) {
    result.err = err;
  }
  result.et = t.stop();
  return result;
};

const executeHooks = async ( hooks, ...args ) => {
  for ( const [ hook, i ] of hooks.entries() ) {
    console.log( `Executing "${hook.type}" hook "${i}"` );
    const result = await execute( hook.fn, ...args );
    hook.result = result;
    if ( !hook.ok ) {
      return false;
    }
  }
  return true;
};

const executeSteps = async ( steps, ...args ) => {
  for ( const step of steps ) {
    console.info( `Executing step ${step.name}` );

    await executeHooks( step.beforeHooks, ...args );

    if ( step.ok ) {
      const r = await execute( step.fn, ...args );
      step.result = r;
    }

    await executeHooks( step.afterHooks, ...args );

    if ( !step.ok ) { return false; }
  }

  return true;
};

const executeUndoSteps = async ( steps, ...args ) => {
  for ( const step of steps ) {
    console.info( `Undoing step ${step.title}` );
    const hook = step.undoHook;
    const result = await execute( hook.fn, ...args );
    hook.result = result;
    if ( !result.ok ) { return false; }
  }
  return true;
};

module.exports = async ( file, ctx, env, timeLimit ) => {
  const testState = TestState.init( );
  const testInterface = TestInterface.init( env, testState );
  const fittest = Fittest.init( testInterface, testState );
  const timeoutTime = parseInt( timeLimit, 10 ) || fiveMinutes;

  console.log( 'Invoke test', file, ctx, env, timeLimit );

  global.fittest = fittest;

  const timeoutMonitor = setTimeout( () => {
    throw new TimeoutError();
  }, timeoutTime );

  require( file ); // eslint-disable-line global-require

  console.log( `Executing "${testState.name}" test` );

  const beforeHooksOk = await executeHooks( testState.beforeHooks, ctx );

  if ( beforeHooksOk ) {
    await executeSteps( testState.steps, ctx );
    await executeUndoSteps( testState.undoSteps, ctx );
  }

  await executeHooks( testState.afterHooks, ctx );

  clearTimeout( timeoutMonitor );
  return testState;
};
