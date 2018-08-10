const EventEmitter = require( 'events' );

const oneMinute = 60000;

module.exports = () => {
  const emitter = new EventEmitter();
  const emittedEvents = new Map();

  return {
    emit( event, data = {} ) {
      emitter.emit( event, data );
      emittedEvents.set( event, data );
    },

    async on( event, threshold = oneMinute ) {
      return new Promise( ( resolve, reject ) => {
        const timeout = setTimeout( () => {
          reject( new Error( `Timed out waiting for "${event}" event to happen.` ) );
        }, threshold );

        // broadcast if was emitted before having the listner
        if ( emittedEvents.has( event ) ) {
          clearTimeout( timeout );
          resolve( emittedEvents.get( event ) );
          emittedEvents.delete( event );
        } else {
          emitter.once( event, ( ...args ) => {
            clearTimeout( timeout );
            resolve( ...args );
          } );
        }
      } );
    }
  };
};
