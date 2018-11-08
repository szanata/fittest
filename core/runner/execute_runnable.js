const Result = require( '../models/result' );
const Timer = require( '../utils/time/timer' );
const TimeoutKiller = require( '../utils/time/timeout_killer' );

module.exports = async ( runnable, timeoutTime, ...args ) => {
  const t = Timer.start();
  const result = Result.init();
  try {
    const timeoutKiller = TimeoutKiller.init( timeoutTime );
    await runnable.fn( ...args );
    timeoutKiller.stop();
  } catch ( err ) {
    result.err = err;
  }
  result.et = t.stop();
  runnable.output = console.flush();
  runnable.result = result;

  return runnable.ok;
};
