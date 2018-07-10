const { expect } = require( 'chai' );
const executePhase = require( './execute_phase' );

describe( 'Execute phase test', () => {
  it( 'Should execute given function with given args', () => {
    const expectedArgs = [ 'abc', 123 ];

    const fn = ( ...args ) => {
      expect( args ).to.deep.eql( expectedArgs );
    };

    return executePhase( fn, expectedArgs );
  } );

  it( 'Should throw error if the function didnt respond in the given timeout', async () => {
    const fn = () => new Promise( resolve => {
      setTimeout( () => {
        resolve();
      }, 1000 );
    } );

    try {
      await executePhase( fn, [], 500 );
      expect.fail();
    } catch ( err ) {
      expect( err.message ).to.eql( 'TIMEOUT' );
    }
  } );
} );
