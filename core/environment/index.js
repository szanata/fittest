const getTestsPaths = require( './get_tests_paths' );
const FwEnv = require( '../models/fw_env' );
const { BlockTypes } = require( '../models/types' );
const runValidations = require( './run_validations' );
const readFwVersion = require( './read_fw_version' );

/*
userOpts:

| testsDir | string | **yes** | *none* | The directory where the tests will be read from. |
| timeoutTime | string | | 5 minutes | The time in milliseconds to wait before a test is killed due timeout. |
| retries | number | | 0 | Number of retries to perform on each test that fails. |
| beforeAll | string | | *none* | Path to a script file to run before the tests |
| afterAll | string | | *none* | Path to a script file to run after the tests |
*/

const blocksOptions = Object.values( BlockTypes );

const optional = [ 'timeoutTime', 'retries' ];

module.exports = {
  init( userOpts, fwFeatures, relativeDir ) {
    runValidations( userOpts );

    const fwEnv = FwEnv.init();

    fwEnv.features = fwFeatures;
    fwEnv.relativeDir = relativeDir;

    fwEnv.testsPaths = getTestsPaths( relativeDir, userOpts.testsDir );

    fwEnv.version = readFwVersion();

    blocksOptions.filter( b => userOpts[b] ).forEach( b => {
      fwEnv.blockPaths[b] = getTestsPaths( relativeDir, userOpts[b] )[0];
    } );

    optional.filter( p => userOpts[p] ).forEach( p => {
      fwEnv[p] = userOpts[p];
    } );

    return fwEnv;
  }
};