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

  it( 'It should send the right data if one event is registered more than one time', () => {
    const eventInterface = createEventInterface();

    const data1 = 'random data';
    const data2 = 'more random data';
    const data3 = 'even more data';
    let foo1Called = false;
    let foo2Called = false;
    let foo3Called = false;

    eventInterface.on( 'foo' ).then( d => { foo1Called = true; assert( d === data1 ); } );
    eventInterface.on( 'foo' ).then( d => { foo2Called = true; assert( d === data2 ); } );
    eventInterface.on( 'foo' ).then( d => { foo3Called = true; assert( d === data3 ); } );

    eventInterface.emit( 'foo', data1 );
    eventInterface.emit( 'foo', data2 );
    eventInterface.emit( 'foo', data3 );

    return new Promise( resolve => {
      setTimeout( () => {
        assert( foo1Called );
        assert( foo2Called );
        assert( foo3Called );
        resolve();
      }, 1000 );
    } );
  } );

  it( 'It should send the right data if events happened before beign registered, and were more than one', () => {
    const eventInterface = createEventInterface();

    const data1 = 'random data';
    const data2 = 'more random data';
    const data3 = 'even more data';
    let foo1Called = false;
    let foo2Called = false;
    let foo3Called = false;

    eventInterface.emit( 'foo', data1 );
    eventInterface.emit( 'foo', data2 );
    eventInterface.emit( 'foo', data3 );

    eventInterface.on( 'foo' ).then( d => { foo1Called = true; assert( d === data1 ); } );
    eventInterface.on( 'foo' ).then( d => { foo2Called = true; assert( d === data2 ); } );
    eventInterface.on( 'foo' ).then( d => { foo3Called = true; assert( d === data3 ); } );

    return new Promise( resolve => {
      setTimeout( () => {
        assert( foo1Called );
        assert( foo2Called );
        assert( foo3Called );
        resolve();
      }, 1000 );
    } );
  } );
} );
