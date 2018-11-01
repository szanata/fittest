const loadTestPaths = require( './load_test_paths' );
const { init: initFeatures } = require( './features' );
const Logger = require( './logger' ).createInternalLogger();
const executeTests = require( './execute_tests' );
const executeBlock = require( './execute_block' );
const EventEmitter = require( 'events' );
const defaults = require( './defaults' );
const msToS = require( './time/ms_to_s' );
const getStackFrameDir = require( './get_stack_frame_dir' );

const quit = status => process.exit( status );

const getBrokenTestsCount = results => results.filter( r => !r.pass ).length;

const printResults = ( results, displaySuccessOutput ) =>
  results
    .filter( r => displaySuccessOutput || !r.pass )
    .forEach( r => {
      Logger.flow( `Output for: "${r.name}"` );
      r.logs.forEach( line => console.log( line ) );
    } );

const runBlock = async ( blockName, emitter, opts ) => {
  if ( !opts[blockName] ) { return null; }

  const [ path ] = loadTestPaths( opts.callerDir, opts[blockName] );
  if ( !path ) { return null; }

  Logger.flow( `Executing "${blockName}" block` );
  const result = await executeBlock( path, emitter, opts );

  if ( !result.pass ) {
    printResults( [ result ], opts );
    process.exit( 1 );
  } else {
    // make the callback from the beforeAll available to each test
    opts.context = result.context;
  }

  return result;
};

const getTotalTime = results => msToS( results.filter( v => !!v ).reduce( ( v, p ) => p.elapsedTime + v, 0 ) );

module.exports = {

  async run( params ) {

    const opts = Object.assign( { }, defaults, params );
    const emitter = new EventEmitter();
    const blocksResults = [];
    opts.context = [];

    try {
      opts.callerDir = getStackFrameDir( 3 );
      const paths = loadTestPaths( opts.callerDir, opts.path );
      const testsSize = paths.length;

      opts.features = await initFeatures( emitter );

      Logger.flow( `Running ${testsSize} tests, relative path: "${opts.callerDir}"` );

      blocksResults.push( await runBlock( 'beforeAll', emitter, opts ) );

      emitter.on( 'single_test_completed', i => Logger.done( `[${i}/${testsSize}], awaiting other tasks...` ) );

      Logger.spinStart();
      const results = await executeTests( paths, emitter, opts );
      Logger.spinStop();

      printResults( results, opts.displaySuccessOutput );

      blocksResults.push( await runBlock( 'afterAll', emitter, opts ) );

      const brokenTestsCount = getBrokenTestsCount( results );
      const totalTime = getTotalTime( results.concat( blocksResults ) );

      if ( brokenTestsCount > 0 ) {
        Logger.fail( `Tests failed: ${brokenTestsCount}. Total run time ${totalTime}s.` );
        quit( 1 );
      } else {
        Logger.pass( `Tests passed. Total run time ${totalTime}s.` );
        quit( 0 );
      }
    } catch ( err ) {
      Logger.fail( 'Startup error' );
      console.error( err );
      quit( 1 );
    }
  }
};
