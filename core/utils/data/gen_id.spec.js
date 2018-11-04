const genId = require( './gen_id' );

describe( 'Gen Id spec', () => {
  it( 'Should generate a random id', () => {
    const unique = new Map();
    const size = 999999;
    Array( size ).fill().map( genId ).map( v => unique.set( v, 0 ) );
    expect( unique.size ).toBe( size );
  } );
} );
