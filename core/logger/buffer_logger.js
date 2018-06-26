const logTestTask = require( './logger_methods/log_test_task' );
const logSub = require( './logger_methods/log_sub' );
const { blue, green, red, white } = require( './logger_methods/std_vars' );

module.exports = () => {
  const output = [];

  const methods = {
    get output() { return output; },
    flow: m => output.push( logTestTask( { color: blue, label: 'Flow', message: m } ) ),
    step: m => output.push( logTestTask( { color: white, label: 'Step', message: m } ) ),
    ok: m => output.push( logTestTask( { color: green, label: 'Ok  ', message: m } ) ),
    error: ( m, details ) => {
      output.push( logTestTask( { color: red, label: 'Err!', message: m } ) );
      if ( details ) {
        output.push( logSub( { label: 'Details', text: details } ) );
      }
    }
  };

  Object.freeze( methods );

  return methods;
};
