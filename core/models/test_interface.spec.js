const TestInterface = require( './test_interface' );
const { randomBytes } = require( 'crypto' );
const { SimpleHooks, SerialHooks } = require( './types' );

describe( 'Test Interface Spec', () => {

  describe( 'Initializing', () => {
    it( 'Should expose the env property', () => {
      const env = { hash: randomBytes( 12 ).toString( 'hex' ) };
      const testInterface = TestInterface.init( env, {} );
      expect( testInterface.env ).toEqual( env );
    } );
  } );
  describe( 'Hooks', () => {
    it( 'Should expose simple hooks', () => {
      const testInterface = TestInterface.init( {}, {} );
      Object.values( SimpleHooks ).forEach( h => {
        expect( testInterface ).toHaveProperty( h );
      } );
    } );

    it( 'Should expose serial hooks', () => {
      const testInterface = TestInterface.init( {}, {} );
      Object.values( SerialHooks ).forEach( h => {
        expect( testInterface ).toHaveProperty( h );
      } );
    } );

    it( 'Should validate hook argument', () => {
      const testInterface = TestInterface.init( {}, {} );
      expect( () => testInterface.after() ).toThrow( TypeError );
    } );

    it( 'Should add a hook to the test when calling that hook', () => {
      const test = { addHook: jest.fn() };
      const testInterface = TestInterface.init( {}, test );
      const fn = () => {};
      testInterface.after( fn );
      expect( test.addHook ).toHaveBeenCalledWith( 'after', fn );
    } );
  } );

  describe( 'Steps', () => {
    it( 'Should expose the step method', () => {
      const testInterface = TestInterface.init( {}, {} );
      expect( testInterface ).toHaveProperty( 'step' );
    } );

    it( 'Should create a step', () => {
      const test = { addStep: jest.fn() };
      const testInterface = TestInterface.init( {}, test );
      const name = 'Foo';
      const fn = () => {};

      testInterface.step( name, fn );
      expect( test.addStep ).toHaveBeenCalledWith( name, fn );
    } );

    it( 'Should create a undo step', () => {
      const hash = randomBytes( 12 ).toString( 'hex' );
      const test = {
        addStep: jest.fn(),
        addHook: jest.fn()
      };
      test.addStep.mockReturnValue( hash );

      const testInterface = TestInterface.init( {}, test );

      const name = 'Foo';
      const fn = () => 'foo';
      const undoFn = () => 'bar';
      testInterface.step( name, fn ).undo( undoFn );

      expect( test.addHook ).toHaveBeenCalledWith( 'undo', undoFn, hash );
    } );

    it( 'Should validate the first step argument as string', () => {
      const testInterface = TestInterface.init( {}, {} );
      expect( () => testInterface.step( 0, () => {} ) ).toThrow( TypeError );
    } );

    it( 'Should validate the second step argument as function', () => {
      const testInterface = TestInterface.init( {}, {} );
      expect( () => testInterface.after( 'foo', 0 ) ).toThrow( TypeError );
    } );
  } );
} );
