const Runnable = require( './runnable' );
const Result = require( './result' );

describe( 'Runnable spec', () => {
  it( 'Initializing', () => {
    const fn = () => 'foo';
    const runnable = Runnable.init( fn );
    expect( runnable.fn ).toEqual( fn );
    expect( runnable.invoked ).toEqual( false );
    expect( runnable.result.serialize() ).toEqual( Result.init().serialize() );
    expect( runnable.outputs ).toEqual( [] );
  } );
} );
