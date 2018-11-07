const runValidations = require( './run_validations' );

describe( 'Environment Spec', () => {

  describe( 'Validation', () => {
    it( 'Should throw an error if opts is not an object', () => {
      expect( () => runValidations() ).toThrow( TypeError );
    } );

    it( 'Should throw an error if opts.testsDir is not an string', () => {
      expect( () => runValidations( { } ) ).toThrow( TypeError );
      expect( () => runValidations( { testsDir: 0 } ) ).toThrow( TypeError );
      expect( () => runValidations( { testsDir: 'foo' } ) ).not.toThrow( Error );
    } );
  } );
} );