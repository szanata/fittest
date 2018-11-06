const Hook = require( './test_hook' );
const TestBitResult = require( './test_bit_result' );
const { DirectHooks } = require( './types' );

describe( 'Test Hook spec', () => {
  it( 'Should return ok if the result is ok', () => {
    const hook = Hook.init();
    hook.result = TestBitResult.init();
    expect( hook.ok ).toBe( true );
  } );

  it( 'Should return NOT ok if the result is not ok', () => {
    const hook = Hook.init();
    const result = TestBitResult.init();
    result.err = new Error();
    hook.result = result;
    expect( hook.ok ).toBe( false );
  } );

  it( 'Should serialize the hook', () => {
    const hook = Hook.init();
    hook.type = DirectHooks.after;

    const result = TestBitResult.init();
    result.err = new Error();

    hook.result = result;

    expect( hook.serialize() ).toEqual( {
      result: result.serialize(),
      type: DirectHooks.after
    } );
  } );
} );
