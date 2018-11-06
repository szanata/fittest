const TestBitResult = require( './test_bit_result' );

describe( 'Test Bit Result Spec', () => {
  it( 'A new empty TestBitResult should be ok', () => {
    const testBitResult = TestBitResult.init();
    expect( testBitResult.ok ).toBe( true );
  } );

  it( 'A TestBitResult should NOT be ok if it receives an error', () => {
    const testBitResult = TestBitResult.init();
    testBitResult.err = new TypeError();
    expect( testBitResult.ok ).toBe( false );
  } );

  describe( 'Serialization', () => {
    it( 'Should serialize a NON ok result', () => {
      const testBitResult = TestBitResult.init();
      const err = new TypeError( 'Ops' );
      testBitResult.err = err;
      const serial = testBitResult.serialize();

      expect( serial ).toEqual( {
        ok: false,
        err: {
          message: err.message,
          stack: err.stack,
          name: 'TypeError'
        }
      } );
    } );

  } );
} );
