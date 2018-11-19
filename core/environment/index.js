const getTestsPaths = require( './get_tests_paths' );
const FwEnv = require( '../models/fw_env' );
const { BlockTypes } = require( '../models/types' );
const runValidations = require( './run_validations' );

/*
userOpts:

| testsDir | string | **yes** | *none* | The directory where the tests will be read from |
| timeoutTime | number | | 5 minutes | The time in milliseconds to wait before a test is killed due timeout |
| eventTimeoutTime | number | | 1 minute | The time in milliseconds to wait before a async event is killed due timeout |
| retries | number | | 0 | Number of retries to perform on each test that fails |
| beforeAll | string | | *none* | Path to a script file to run before the tests |
| afterAll | string | | *none* | Path to a script file to run after the tests |
*/

const blocksOptions = Object.values( BlockTypes );

const optional = [ 'eventTimeoutTime', 'timeoutTime', 'retries' ];

module.exports = {
  init( userOpts, fwFeatures, relativeDir ) {
    runValidations( userOpts );

    const fwEnv = FwEnv.init();

    fwEnv.features = fwFeatures;
    fwEnv.relativeDir = relativeDir;

    fwEnv.testsPaths = getTestsPaths( relativeDir, userOpts.testsDir );

    if ( fwEnv.testsPaths.length === 0 ) {
      console.log( 'Sorry. No tests found. Bye ;)' );
      process.exit( 0 );
    }

    blocksOptions.filter( b => userOpts[b] ).forEach( b => {
      fwEnv.blockPaths[b] = getTestsPaths( relativeDir, userOpts[b] )[0];
    } );

    optional.filter( p => userOpts[p] ).forEach( p => {
      fwEnv[p] = userOpts[p];
    } );

    return fwEnv;
  }
};