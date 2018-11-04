const Timer = require( './timer' );

describe( 'Timer Spec', () => {

  it( 'Should run multiple timers without interfering with each other', () => {
    const t1 = Timer.start();
    const t2 = Timer.start();
    let t1Result;
    let t2Result;

    setTimeout( () => {
      t1Result = t1.stop();
    }, 500 );

    setTimeout( () => {
      t2Result = t2.stop();
    }, 1000 );

    setTimeout( () => {
      expect( t1Result ).toBeGreaterThan( 500 );
      expect( t1Result ).toBeLessThan( 510 );

      expect( t2Result ).toBeGreaterThan( 1000 );
      expect( t2Result ).toBeLessThan( 1010 );
    } );
  } );
} );
