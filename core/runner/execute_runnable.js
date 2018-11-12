const Result = require( '../models/result' );
const Timer = require( '../utils/time/timer' );
const TimeoutError = require( '../models/errors/timeout_error' );

const throwTimeoutOnTime = t => new Promise( (_, rj) => 
  setTimeout( () => rj( new TimeoutError( t )), t ) 
);

const runFn = async (fn, ...args) => {
  try {    
    await fn( ...args );
  } catch ( err ) {
    throw err;
  }
};

module.exports = async ( runnable, timeoutTime, ...args ) => {
  const t = Timer.start();
  const result = Result.init();

  const promises = [ throwTimeoutOnTime( timeoutTime ), runFn( runnable.fn, ...args) ];


  try {    
    await Promise.race( promises );
  } catch ( err ) {
    result.err = err;
  };

  result.et = t.stop();
  runnable.outputs = console.flush();
  runnable.result = result;

  return runnable.ok;
};
