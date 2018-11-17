const ProgressBar = require( './progress_bar' );
const printTiming = require( './print_timing' );
const printOutputs = require( './print_outputs' );
const printSetup = require( './print_setup' );
const printResult = require( './print_result' );
const printHeader = require( './print_header' );

module.exports = {
  header( package ) {
    printHeader( package );
  },
  result( fwResult ) {
    printResult( fwResult );
    printTiming( fwResult );
    printOutputs( fwResult );
  },
  setup( fwEnv ) {
    printSetup( fwEnv );
  },
  listenUpdates( emitter, fwEnv ) {
    const progressBar = ProgressBar.init( fwEnv.tasksCount );
    emitter.on( 'task_done', () => progressBar.update( ) );
  }
};
