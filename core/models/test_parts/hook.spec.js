const Hook = require( './hook' );
const Result = require( './result' );

describe( 'Test Hook spec', () => {
  it( 'Should return ok if the result is ok', () => {
    const hook = Hook.init();
    hook.result = Result.init();
    expect( hook.result.ok ).toBe( true );
  } );

  it( 'Should return NOT ok if the result is not ok', () => {
    const hook = Hook.init();
    const result = Result.init();
    result.err = new Error();
    hook.result = result;
    expect( hook.result.ok ).toBe( false );
  } );
} );
