const createTestEnv = require( './create_test_env' );
const serverUrl = 'http://google.com';
const id = Math.ceil( Math.random() * 999999 );
const eventTimeoutTime = Math.ceil( Math.random() * 999999 );
const fwEvent = {
  features: {
    serverUrl
  },
  eventTimeoutTime
};
const emitter = {
  once: jest.fn()
};

describe( 'Create test env spec', () => {
  it( 'Should init a new test env', () => {
    const testEnv = createTestEnv( fwEvent, id, emitter );
    expect( testEnv.serverUrl ).toBe( `${serverUrl}/${id}` );
    expect( testEnv.asyncEvent ).toBeInstanceOf( Function );
  } );

  describe( '.asyncEvent method validations', () => {
    let testEnv;

    beforeEach( () => {
      testEnv = createTestEnv( fwEvent, id, emitter );
      emitter.once.mockReset();
    } );

    it( 'Should validate the first argument', () => {
      expect( () => {
        testEnv.asyncEvent( null );
      } ).toThrow( TypeError );

      expect( () => {
        testEnv.asyncEvent( 'http-put' );
      } ).toThrow( TypeError );
    } );

    it( 'Should validate the second argument', () => {
      const eventName = 'http-post';

      expect( () => {
        testEnv.asyncEvent( eventName, '1000' );
      } ).toThrow( TypeError );

      expect( () => {
        testEnv.asyncEvent( eventName, true );
      } ).toThrow( TypeError );
    } );

    it( 'Should call emitter.once fn with the args', () => {
      const eventName = 'http-post';
      const timeoutTime = 1000;

      testEnv.asyncEvent( eventName, timeoutTime );
      expect( emitter.once ).toHaveBeenCalledWith( eventName, timeoutTime );
    } );


    it( 'Should call emitter.once fn with the "eventName" and the default timeout when that is not passed', () => {
      const eventName = 'http-post';

      testEnv.asyncEvent( eventName );
      expect( emitter.once ).toHaveBeenCalledWith( eventName, eventTimeoutTime );
    } );
  } );
} );