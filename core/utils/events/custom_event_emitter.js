const eventWasEmitted = ( events, name ) => events.filter( ev => ev[0] === name ).length > 0;

const consumeEvent = ( events, name ) => {
  const i = events.findIndex( ev => ev[0] === name );
  const data = events[i][1];
  events.splice( i, 1 );
  return data;
};
/**
 * Custom Event Emitter
 * Can listen for events that already were emitted before the callback was assigned
 */
module.exports = {
  init() {
    const events = [];

    return {
      emit( event, data = {} ) {
        events.push( [ event, data ] );
      },

      async once( name, threshold = 60000 ) {
        return new Promise( ( resolve, reject ) => {
          const timeout = setTimeout( () => {
            clearInterval( eventDetection );
            reject( new Error( `Timed out waiting for "${name}" event to happen.` ) );
          }, threshold );

          const eventDetection = setInterval( () => {
            if ( eventWasEmitted( events, name ) ) {
              clearTimeout( timeout );
              clearInterval( eventDetection );
              resolve( consumeEvent( events, name ) );
            }
          }, 100 );
        } );
      }
    };
  }
};
