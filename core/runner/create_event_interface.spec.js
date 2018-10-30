const createEventInterface = require( './create_event_interface' );
const eventName = 'test-event';

describe( 'Event interface spec', () => {

  describe( 'Should register a event and then be notified when it happens', () => {
    it( 'When the event is triggered after the registration', async () => {
      const eventInterface = createEventInterface();

      const promise = new Promise( resolve =>
        eventInterface.once( eventName ).then( resolve ) );

      eventInterface.emit( eventName );

      await promise;
    } );

    it( 'When the event is triggered before the registration', async () => {
      const eventInterface = createEventInterface();

      eventInterface.emit( eventName );

      await eventInterface.once( eventName );
    } );
  } );

  describe( 'Emitting the event just once for each time it was registered (.once)', () => {

    it( 'When the events are triggered after the registration', async () => {
      const eventInterface = createEventInterface();
      const times = 2;
      const calls = 5;

      let callsCount = 0;
      Array( times ).fill().forEach( () => eventInterface.once( eventName ).then( () => callsCount += 1 ) );

      const promise = new Promise( resolve => {
        setTimeout( () => {
          if ( callsCount !== times ) {
            throw new Error( `Event was called ${callsCount} and should had been ${times}` );
          }
          resolve();
        }, 2000 );
      } );

      Array( calls ).fill().forEach( () => eventInterface.emit( eventName ) );
      await promise;
    } );

    it( 'When the events are triggered before the registration', async () => {
      const eventInterface = createEventInterface();
      const times = 2;
      const calls = 5;

      Array( calls ).fill().forEach( () => eventInterface.emit( eventName ) );

      let callsCount = 0;
      Array( times ).fill().forEach( () => eventInterface.once( eventName ).then( () => callsCount++ ) );

      await new Promise( resolve => {
        setTimeout( () => {
          if ( callsCount !== times ) {
            throw new Error( `Event was called ${callsCount} and should had been ${times}` );
          }
          resolve();
        }, 2000 );
      } );
    } );

    it( 'When some events are triggered before, and some after the registration', async () => {
      const eventInterface = createEventInterface();
      const times = 3;
      const calls1 = 2;
      const calls2 = 5;

      Array( calls1 ).fill().forEach( () => eventInterface.emit( eventName ) );

      let callsCount = 0;
      Array( times ).fill().forEach( () => eventInterface.once( eventName ).then( () => callsCount++ ) );

      const promise = new Promise( resolve => {
        setTimeout( () => {
          if ( callsCount !== times ) {
            throw new Error( `Event was called ${callsCount} and should had been ${times}` );
          }
          resolve();
        }, 2000 );
      } );

      Array( calls2 ).fill().forEach( () => eventInterface.emit( eventName ) );

      await promise;
    } );
  } );

  describe( 'Sending event data to the callback', () => {
    it( 'When the events are triggered after the registration', async () => {
      const eventInterface = createEventInterface();
      const size = 5;
      const eventsData = Array( size ).fill().map( () => Math.ceil( Math.random() * 1000 ) );

      const promise = new Promise( resolve => {
        let callsCount = 0;
        Array( size ).fill().forEach( ( _, i ) => {
          eventInterface.once( eventName ).then( data => {
            expect( data ).toBe( eventsData[i] );
            callsCount++;
            if ( callsCount === size ) {
              resolve();
            }
          } );
        } );
      } );

      Array( size ).fill().forEach( ( _, i ) => eventInterface.emit( eventName, eventsData[i] ) );

      await promise;
    } );

    it( 'When the events are triggered before the registration', async () => {
      const eventInterface = createEventInterface();
      const size = 5;
      const eventsData = Array( size ).fill().map( () => Math.ceil( Math.random() * 1000 ) );

      Array( size ).fill().forEach( ( _, i ) => eventInterface.emit( eventName, eventsData[i] ) );

      await new Promise( resolve => {
        let callsCount = 0;
        Array( size ).fill().forEach( ( _, i ) => {
          eventInterface.once( eventName ).then( data => {
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
