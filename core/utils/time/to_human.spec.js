const toHuman = require( './to_human' );

describe( 'To Human Spec', () => {
  it( 'Should format a long number', () => {
    const time = 34973474;
    expect( toHuman( time ) ).toBe( '9h42m53s' );
  } );
} );
