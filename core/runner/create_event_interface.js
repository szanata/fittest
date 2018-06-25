const EventEmitter = require( 'events' );

const oneMinute = 60000;

module.exports = () => {
  const emitter = new EventEmitter();

  return {
    emit( event, data ) {
      emitter.emit( event, data );
    },

    async on( event, threshold = oneMinute ) {
      return new Promise( ( resolve, reject ) => {
        const timeout = setTimeout( () => {
          reject( new Error( `Timed out waiting for "${event}" event to happen.` ) );
        }, threshold );

        emitter.once( event, ( ...args ) => {
          clearTimeout( timeout );
          resolve( ...args );
        } );
      } );
    }
  };
};
