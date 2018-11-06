const Fittest = require( './fittest' );
const { randomBytes } = require( 'crypto' );

describe( 'fittest Spec', () => {
  it( 'Should throw error if the first arg is not a string', () => {
    const fittest = Fittest.init();
    expect( () => fittest() ).toThrow( TypeError );
  } );

  it( 'Should throw error if the second arg is not a function', () => {
    const fittest = Fittest.init();
    expect( () => fittest( 'Hi there!' ) ).toThrow( TypeError );
  } );

  it( 'Should set the test name to the testState', () => {
    const testState = {};
    const fittest = Fittest.init( {}, testState );
    const name = 'Hi ther';
    fittest( name, () => {} );
    expect( testState.name ).toBe( name );
  } );

  it( 'Should expose the testInterface', () => {
    const testInterface = { hash: randomBytes( 16 ).toString( 'hex' ) };
    const fittest = Fittest.init( testInterface, {} );
    let called = false;
    fittest( '', t => {
      called = true;
      expect( t ).toEqual( testInterface );
    } );
    expect( called ).toBe( true );
  } );
} );

