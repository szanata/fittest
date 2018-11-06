const getTestsPaths = require( './get_tests_paths' );
const { join } = require( 'path' );
const {
  readdirSync,
  lstatSync,
  existsSync,
  rmdirSync,
  writeFileSync,
  unlinkSync,
  mkdirSync
} = require( 'fs' );

const dirname = './base_dir';

/**
 * Remove directory recursively
 * @param {string} dirPath
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf( dirPath ) {
  if ( !existsSync( dirPath ) ) {
    return;
  }

  readdirSync( dirPath ).forEach( entry => {
    const entryPath = join( dirPath, entry );
    if ( lstatSync( entryPath ).isDirectory() ) {
      rimraf( entryPath );
    } else {
      unlinkSync( entryPath );
    }
  } );
  rmdirSync( dirPath );
}

describe( 'getTestsPaths Spec', () => {

  afterEach( () => {
    rimraf( dirname );
  } );

  describe( 'When a file path is informed', () => {

    it( 'Without the .js extension', () => {
      mkdirSync( dirname );
      mkdirSync( join( dirname, 'tests' ) );
      mkdirSync( join( dirname, 'tests', 'bar' ) );
      writeFileSync( join( dirname, 'tests', 'bar', 'index.js' ), '' );

      const testPath = join( dirname, 'tests', 'bar', 'index.js' );
      const results = getTestsPaths( dirname, 'tests/bar/index' );

      expect( results ).toEqual( [ testPath ] );
    } );

    it( 'With the .js extension', () => {
      mkdirSync( dirname );
      mkdirSync( join( dirname, 'tests' ) );
      mkdirSync( join( dirname, 'tests', 'bar' ) );
      writeFileSync( join( dirname, 'tests', 'bar', 'index.js' ), '' );

      const testPath = join( dirname, 'tests', 'bar', 'index.js' );
      const results = getTestsPaths( dirname, 'tests/bar/index.js' );

      expect( results ).toEqual( [ testPath ] );
    } );

    it( 'Should thro error when the file does not exists', () => {
      expect( () => {
        getTestsPaths( dirname, 'tests/bar/index.js' );
      } ).toThrow( Error );
    } );
  } );

  describe( 'When a folder is informed', () => {

    it( 'Should load each index file from directories which end in "_test"', () => {
      mkdirSync( dirname );
      mkdirSync( join( dirname, 'tests' ) );
      mkdirSync( join( dirname, 'tests', 'bar' ) );
      mkdirSync( join( dirname, 'tests', 'bar_test' ) );
      mkdirSync( join( dirname, 'tests', 'foo_test' ) );
      mkdirSync( join( dirname, 'tests', 'zum_test' ) );
      writeFileSync( join( dirname, 'tests', 'bar', 'index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'bar_test', 'index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'bar_test', 'non_index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'foo_test', 'index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'zum_test', 'non_index.js' ), '' );

      const testsPaths = [
        join( dirname, 'tests', 'bar_test', 'index.js' ),
        join( dirname, 'tests', 'foo_test', 'index.js' )
      ];
      const results = getTestsPaths( dirname, 'tests' );

      expect( results ).toEqual( testsPaths );
    } );

    it( 'Should load each index file that ends in .test.js inside directories which end in "_test"', () => {
      mkdirSync( dirname );
      mkdirSync( join( dirname, 'tests' ) );
      mkdirSync( join( dirname, 'tests', 'bar' ) );
      mkdirSync( join( dirname, 'tests', 'bar_test' ) );
      mkdirSync( join( dirname, 'tests', 'foo_test' ) );
      mkdirSync( join( dirname, 'tests', 'zum_test' ) );
      writeFileSync( join( dirname, 'tests', 'bar', 'index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'bar_test', 'index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'bar_test', 'some.test.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'bar_test', 'non_index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'foo_test', 'index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'foo_test', 'some.test.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'zum_test', 'non_index.js' ), '' );
      writeFileSync( join( dirname, 'tests', 'zum_test', 'some.test.js' ), '' );

      const testsPaths = [
        join( dirname, 'tests', 'bar_test', 'index.js' ),
        join( dirname, 'tests', 'bar_test', 'some.test.js' ),
        join( dirname, 'tests', 'foo_test', 'index.js' ),
        join( dirname, 'tests', 'foo_test', 'some.test.js' ),
        join( dirname, 'tests', 'zum_test', 'some.test.js' )
      ];
      const results = getTestsPaths( dirname, 'tests' );

      expect( results ).toEqual( testsPaths );
    } );
  } );
} );
