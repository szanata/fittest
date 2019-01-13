const isCi = require( './is_ci' );

describe( 'Should detect if is CI env', () => {

  it( 'Should detect travis', () => {
    process.env.TRAVIS = true;
    expect( isCi() ).toBe( true );
  } );
} );
