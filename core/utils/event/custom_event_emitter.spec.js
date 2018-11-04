const CustomEventEmitter = require( './custom_event_emitter' );
const eventName = 'test-event';

describe( 'Custom Event Emitter spec', () => {

  describe( 'Should register a event and then be notified when it happens', () => {
    it( 'When the event is triggered after the registration', async () => {
      const emitter = CustomEventEmitter.init();

      const promise = new Promise( resolve =>
        emitter.once( eventName ).then( resolve ) );

      emitter.emit( eventName );

      await promise;
    } );

    it( 'When the event is triggered before the registration', async () => {
      const emitter = CustomEventEmitter.init();

      emitter.emit( eventName );

      await emitter.once( eventName );
    } );
  } );

  describe( 'Emitting the event just once for each time it was registered (.once)', () => {

    it( 'When the events are triggered after the registration', async () => {
      const emitter = CustomEventEmitter.init();
      const times = 2;
      const calls = 5;

      let callsCount = 0;
      Array( times ).fill().forEach( () => emitter.once( eventName ).then( () => callsCount += 1 ) );

      const promise = new Promise( resolve => {
        setTimeout( () => {
          if ( callsCount !== times ) {
            throw new Error( `Event was called ${callsCount} and should had been ${times}` );
          }
          resolve();
        }, 1000 );
      } );

      Array( calls ).fill().forEach( () => emitter.emit( eventName ) );
      await promise;
    } );

    it( 'When the events are triggered before the registration', async () => {
      const emitter = CustomEventEmitter.init();
      const times = 2;
      const calls = 5;

      Array( calls ).fill().forEach( () => emitter.emit( eventName ) );

      let callsCount = 0;
      Array( times ).fill().forEach( () => emitter.once( eventName ).then( () => callsCount++ ) );

      await new Promise( resolve => {
        setTimeout( () => {
          if ( callsCount !== times ) {
            throw new Error( `Event was called ${callsCount} and should had been ${times}` );
          }
          resolve();
        }, 1000 );
      } );
    } );

    it( 'When some events are triggered before, and some after the registration', async () => {
      const emitter = CustomEventEmitter.init();
      const times = 3;
      const calls1 = 2;
      const calls2 = 5;

      Array( calls1 ).fill().forEach( () => emitter.emit( eventName ) );

      let callsCount = 0;
      Array( times ).fill().forEach( () => emitter.once( eventName ).then( () => callsCount++ ) );

      const promise = new Promise( resolve => {
        setTimeout( () => {
          if ( callsCount !== times ) {
            throw new Error( `Event was called ${callsCount} and should had been ${times}` );
          }
          resolve();
        }, 1000 );
      } );

      Array( calls2 ).fill().forEach( () => emitter.emit( eventName ) );

      await promise;
    } );
  } );

  describe( 'Sending event data to the callback', () => {
    it( 'When the events are triggered after the registration', async () => {
      const emitter = CustomEventEmitter.init();
      const size = 5;
      const eventsData = Array( size ).fill().map( () => Math.ceil( Math.random() * 1000 ) );

      const promise = new Promise( resolve => {
        let callsCount = 0;
        Array( size ).fill().forEach( ( _, i ) => {
          emitter.once( eventName ).then( data => {
            expect( data ).toBe( eventsData[i] );
            callsCount++;
            if ( callsCount === size ) {
              resolve();
            }
          } );
        } );
      } );

      Array( size ).fill().forEach( ( _, i ) => emitter.emit( eventName, eventsData[i] ) );

      await promise;
    } );

    it( 'When the events are triggered before the registration', async () => {
      const emitter = CustomEventEmitter.init();
      const size = 5;
      const eventsData = Array( size ).fill().map( () => Math.ceil( Math.random() * 1000 ) );

      Array( size ).fill().forEach( ( _, i ) => emitter.emit( eventName, eventsData[i] ) );

      await new Promise( resolve => {
        let callsCount = 0;
        Array( size ).fill().forEach( ( _, i ) => {
          emitter.once( eventName ).then( data => {
            expect( data ).toBe( eventsData[i] );
            callsCount++;
            if ( callsCount === size ) {
              resolve();
            }
          } );
        } );
      } );
    } );
  } );
} );
