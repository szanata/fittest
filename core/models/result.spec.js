const Result = require( './result' );

describe( 'Result Spec', () => {
  it( 'A new empty Result should be ok', () => {
    const result = Result.init();
    expect( result.ok ).toBe( true );
  } );

  it( 'A Result should NOT be ok if it receives an error', () => {
    const result = Result.init();
    result.err = new TypeError();
    expect( result.ok ).toBe( false );
  } );

  describe( 'Serialization', () => {
    it( 'Should serialize a NON ok result', () => {
      const result = Result.init();
      const err = new TypeError( 'Ops' );
      result.err = err;
      const serial = result.serialize();

      expect( serial ).toEqual( {
        ok: false,
        et: 0,
        err: {
          message: err.message,
          stack: err.stack,
          name: 'TypeError'
        }
      } );
    } );

  } );
} );
