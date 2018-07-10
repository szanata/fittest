const EventEmitter = require( 'events' );

const oneMinute = 60000;

module.exports = () => {
  const emitter = new EventEmitter();
  const emittedEvents = {};

  return {
    emit( event, data = {} ) {
      emitter.emit( event, data );
      emittedEvents[event] = data;
    },

    async on( event, threshold = oneMinute ) {
      return new Promise( ( resolve, reject ) => {
        const timeout = setTimeout( () => {
          reject( new Error( `Timed out waiting for "${event}" event to happen.` ) );
        }, threshold );

        if ( Object.keys( emittedEvents ).includes( event ) ) {
          resolve( emittedEvents[event] );
          delete emittedEvents[event];
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
