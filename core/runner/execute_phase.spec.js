const executePhase = require( './execute_phase' );
const TimeoutError = require( './timeout_error' );

describe( 'Execute phase test', () => {
  it( 'Should execute given function with given args', async () => {
    const args = [ 'abc', 123 ];
    const fn = jest.fn();

    await executePhase( fn, args );

    expect( fn ).toHaveBeenCalledWith( ...args );
  } );

  it( 'Should emit any error during the execution', async () => {
    const msg = 'Test Error';
    const fn = jest.fn();
    fn.mockRejectedValue( new Error( msg ) );

    await expect( executePhase( fn, [], 500 ) ).rejects.toThrow( new Error( msg ) );
  } );

  it( 'Should throw error if the function didn\'t return on time', async () => {
    const fn = jest.fn();
    fn.mockImplementation( () => new Promise( resolve => {
      setTimeout( () => resolve(), 1000 );
    } ) );

    await expect( executePhase( fn, [], 500 ) ).rejects.toThrow( new TimeoutError() );
  } );
} );
