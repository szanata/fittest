const EventEmitter = require( 'events' );

module.exports = () => {
  const emitter = new EventEmitter();
  const emitterId = String( Math.ceil( Math.random() * 10000 ) );

  return {
    emit( event, data ) {
      emitter.emit( emitterId + event, data );
    },

    get id() {
      return emitterId;
    },

    async on( event ) {
      return new Promise( ( resolve, reject ) => {
        const timeout = setTimeout( () => {
          reject( new Error( `Timed out waiting for "${event}"" event to happen.` ) );
        }, 60000 );

        emitter.once( emitterId + event, ( ...args ) => {
          clearTimeout( timeout );
          resolve( ...args );
        } );
      } );
    }
  };
};
