const fn = require( './run_validations' );

const testsDir = '/foo/bar.js';

describe( 'Environment Spec', () => {

  describe( 'Validation', () => {
    it( 'Should throw an error if opts is not an object', () => {
      expect( () => fn() ).toThrow( TypeError );
    } );

    it( 'Should throw an error if opts.testsDir is not an string', () => {
      expect( () => fn( { } ) ).toThrow( TypeError );
      expect( () => fn( { testsDir: 0 } ) ).toThrow( TypeError );
      expect( () => fn( { testsDir } ) ).not.toThrow( Error );
    } );

    it( 'Should throw an error if opts.beforeAll is not an string/null/undefined', () => {
      const opts = { testsDir };
      expect( () => fn( Object.assign( { beforeAll: 0 }, opts ) ) ).toThrow( TypeError );
      expect( () => fn( Object.assign( { beforeAll: null }, opts ) ) ).not.toThrow( TypeError );
      expect( () => fn( Object.assign( { beforeAll: undefined }, opts ) ) ).not.toThrow( TypeError );
    } );

    it( 'Should throw an error if opts.afterAll is not an string/null/undefined', () => {
      const opts = { testsDir };
      expect( () => fn( Object.assign( { afterAll: 0 }, opts ) ) ).toThrow( TypeError );
      expect( () => fn( Object.assign( { afterAll: null }, opts ) ) ).not.toThrow( TypeError );
      expect( () => fn( Object.assign( { afterAll: undefined }, opts ) ) ).not.toThrow( TypeError );
    } );

    it( 'Should throw an error if opts.retries is not an number/null/undefined', () => {
      const opts = { testsDir };
      expect( () => fn( Object.assign( { retries: false }, opts ) ) ).toThrow( TypeError );
      expect( () => fn( Object.assign( { retries: '0' }, opts ) ) ).toThrow( TypeError );
      expect( () => fn( Object.assign( { retries: null }, opts ) ) ).not.toThrow( TypeError );
      expect( () => fn( Object.assign( { retries: undefined }, opts ) ) ).not.toThrow( TypeError );
    } );

    it( 'Should throw an error if opts.timeoutTime is not an string/null/undefined', () => {
      const opts = { testsDir };
      expect( () => fn( Object.assign( { timeoutTime: false }, opts ) ) ).toThrow( TypeError );
      expect( () => fn( Object.assign( { timeoutTime: '0' }, opts ) ) ).toThrow( TypeError );
      expect( () => fn( Object.assign( { timeoutTime: null }, opts ) ) ).not.toThrow( TypeError );
      expect( () => fn( Object.assign( { timeoutTime: undefined }, opts ) ) ).not.toThrow( TypeError );
    } );
  } );
} );