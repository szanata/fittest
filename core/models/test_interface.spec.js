const TestInterface = require( './test_interface' );
const { randomBytes } = require( 'crypto' );
const { DirectHooks } = require( './types' );

describe( 'Test Interface Spec', () => {

  describe( 'Initializing', () => {
    it( 'Should expose the env property', () => {
      const env = { hash: randomBytes( 12 ).toString( 'hex' ) };
      const testInterface = TestInterface.init( env, {} );
      expect( testInterface.env ).toEqual( env );
    } );
  } );

  describe( 'Hooks', () => {
    it( 'Should expose direct hooks', () => {
      const testInterface = TestInterface.init( {}, {} );
      expect( testInterface ).toHaveProperty( ...Object.values( DirectHooks ) );
    } );

    it( 'Should validate hook argument', () => {
      const testInterface = TestInterface.init( {}, {} );
      expect( () => testInterface.after() ).toThrow( TypeError );
    } );

    it( 'Should add a hook to the testState when calling that hook', () => {
      const testState = { addHook: jest.fn() };
      const testInterface = TestInterface.init( {}, testState );
      const fn = () => {};
      testInterface.after( fn );
      expect( testState.addHook ).toHaveBeenCalledWith( 'after', fn );
    } );
  } );

  describe( 'Steps', () => {
    it( 'Should expose the step method', () => {
      const testInterface = TestInterface.init( {}, {} );
      expect( testInterface ).toHaveProperty( 'step' );
    } );

    it( 'Should create a step', () => {
      const testState = { addStep: jest.fn() };
      const testInterface = TestInterface.init( {}, testState );
      const name = 'Foo';
      const fn = () => {};

      testInterface.step( name, fn );
      expect( testState.addStep ).toHaveBeenCalledWith( name, fn );
    } );

    it( 'Should create a undo step', () => {
      const hash = randomBytes( 12 ).toString( 'hex' );
      const testState = {
        addStep: jest.fn(),
        addHook: jest.fn()
      };
      testState.addStep.mockReturnValue( hash );

      const testInterface = TestInterface.init( {}, testState );

      const name = 'Foo';
      const fn = () => 'foo';
      const undoFn = () => 'bar';
      testInterface.step( name, fn ).undo( undoFn );

      expect( testState.addHook ).toHaveBeenCalledWith( 'undo', undoFn, hash );
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