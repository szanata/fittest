const { assert } = require( 'chai' );
const createEventInterface = require( './create_event_interface' );

describe( 'Create event interface test', () => {
  it( 'Should register a event and then be notified when it happens', () => {
    const eventInterface = createEventInterface();

    return new Promise( resolve => {
      eventInterface.on( 'foo' ).then( () => {
        assert( true );
        resolve();
      } );

      eventInterface.emit( 'foo' );
    } );
  } );

  it( 'If the event happens before the registration, it still have be triggered when registered', () => {
    const eventInterface = createEventInterface();

    eventInterface.emit( 'foo' );

    return eventInterface.on( 'foo' ).then( () => {
      assert( true );
    } );
  } );

  it( 'It should not emit events more than once', () => {
    const eventInterface = createEventInterface();

    eventInterface.emit( 'foo' );

    return new Promise( resolve => {
      let calledCount = 0;
      eventInterface.on( 'foo' ).then( () => {
        calledCount += 1;
      } );

      setTimeout( () => {
        assert( calledCount === 1 );
        resolve();
      }, 1000 );

      eventInterface.emit( 'foo' );
      eventInterface.emit( 'foo' );
    } );
  } );

  it( 'It should not emit events more than once even on past events', () => {
    const eventInterface = createEventInterface();

    eventInterface.emit( 'foo' );
    eventInterface.emit( 'foo' );

    let calledCount = 0;
    eventInterface.on( 'foo' ).then( () => calledCount++ );

    return new Promise( resolve => {
      setTimeout( () => {
        assert( calledCount === 1 );
        resolve();
      }, 1000 );
    } );
  } );
} );
