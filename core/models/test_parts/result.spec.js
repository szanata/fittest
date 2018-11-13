const Result = require( './result' );

describe( 'Result Spec', () => {
  it( 'A new empty Result should be ok', () => {
    const result = Result.init();
    expect( result.ok ).toBe( true );
  } );

  it( 'A new empty Result should be not be ok if it received this as arg', () => {
    const result = Result.init( { ok: false } );
    expect( result.ok ).toBe( false );
  } );

  it( 'A result should NOT be ok if it receives an error', () => {
    const result = Result.init();
    result.err = new TypeError();
    expect( result.ok ).toBe( false );
  } );

  describe( 'Serialization', () => {
    it( 'Should serialize a NON ok result', () => {
      const time = 200;
      const result = Result.init( { ok: false, et: 200 } );

      expect( result.serialize() ).toEqual( {
        ok: false,
        et: time,
        err: null
      } );
    } );

    it( 'Should serialize a NON ok result', () => {
      const result = Result.init();
      const err = new TypeError( 'Ops' );
      result.err = err;

      expect( result.serialize() ).toEqual( {
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
