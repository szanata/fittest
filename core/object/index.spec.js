const serializeMap = require( './serialize_map' );
const deserializeMap = require( './deserialize_map' );

describe( 'Map serialize/deserialize', () => {

  it( 'Should serialize a map to string, and than serialize back to map', () => {
    const m = new Map();

    m.set( 'foo', -1 );
    m.set( true, null );
    m.set( 0.3434354545, 0 );

    const str = serializeMap( m );
    const map = deserializeMap( str );

    expect( map.get( 'foo' ) ).toBe( m.get( 'foo' ) );
    expect( map.get( true ) ).toBe( m.get( true ) );
    expect( map.get( 0.3434354545 ) ).toBe( m.get( 0.3434354545 ) );
  } );
} );
