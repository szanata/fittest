const execute = require( './execute_runnable' );
// const Result = require( '../models/test_parts/result' );
const Runnable = require( '../models/test_parts/runnable' );

console.flush = jest.fn();

describe( 'Execute Runnable Spec', () => {

  it( 'Should invoke a runnable with the arguments', async () => {
    console.flush.mockReturnValue( [] );
    const fn = jest.fn();
    const args = [ 'foo', 'bar' ];
    const runnable = Runnable.init( fn );
    await execute( runnable, 1000, ...args );
    expect( fn ).toHaveBeenCalledWith( ...args );
  } );

  it( 'Should set the output and invoked of the runnable', async () => {
    const outputs = [ 'foo', 'bar' ];
    console.flush.mockReturnValue( outputs );
    const fn = jest.fn();
    const runnable = Runnable.init( fn );

    await execute( runnable, 1000 );
    expect( runnable.outputs ).toEqual( outputs );
    expect( runnable.invoked ).toEqual( true );
  } );

  describe( 'Result Spec', () => {

    it( 'Should set the result', async () => {
      console.flush.mockReturnValue( [] );
      const t = 500;
      const fn = jest.fn().mockImplementation( () => new Promise( r => setTimeout( () => r(), t ) ) );
      const runnable = Runnable.init( fn );

      await execute( runnable, 1000 );
      expect( runnable.result.serialize().et ).not.toBeLessThan( 500 );
      expect( runnable.result.serialize().et ).toBeLessThan( 510 );
    } );

    it( 'Should append errors to the result', async () => {
      console.flush.mockReturnValue( [] );
      const err = new Error();
      const fn = jest.fn().mockRejectedValue( err );
      const runnable = Runnable.init( fn );

      await execute( runnable, 1000 );
      expect( runnable.result.serialize() ).toEqual( {
        ok: false,
        err: {
          message: err.message,
          name: err.name,
          stack: err.stack
        },
        et: expect.anything()
      } );
    } );
  } );
} );
