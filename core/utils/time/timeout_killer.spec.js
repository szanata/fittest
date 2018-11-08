const TimeoutKiller = require( './timeout_killer' );
const TimeoutError = require( '../../models/errors/timeout_error' );

describe( 'TimeoutKiller Spec', () => {
  it( 'Should throw an error after x time', async () => {
    expect( new Promise( () => {
      TimeoutKiller.init( 100 );
    } ) ).rejects.toThrow( TimeoutError );
  } );

  it( 'Should be stoppable by calling .stop()', async () => {
    expect( new Promise( r => {
      const timeoutKiller = TimeoutKiller.init( 100 );
      setTimeout( () => timeoutKiller.stop(), 50 );
      setTimeout( () => r( true ), 150 );
    } ) ).resolves.toBe( true );
  } );
} );
