const oneMinute = 60000;

module.exports = () => {
  const events = [];

  const eventWasEmitted = name => events.filter( ev => ev[0] === name ).length > 0;

  const consumeEvent = name => {
    const i = events.findIndex( ev => ev[0] === name );
    const data = events[i][1];
    events.splice( i, 1 );
    return data;
  };

  return {
    emit( event, data = {} ) {
      events.push( [ event, data ] );
    },

    async once( eventName, threshold = oneMinute ) {
      return new Promise( ( resolve, reject ) => {
        const timeout = setTimeout( () => {
          clearInterval( eventDetection );
          reject( new Error( `Timed out waiting for "${eventName}" event to happen.` ) );
        }, threshold );

        const eventDetection = setInterval( () => {
          if ( eventWasEmitted( eventName ) ) {
            clearTimeout( timeout );
            clearInterval( eventDetection );
            resolve( consumeEvent( eventName ) );
          }
        }, 100 );
      } );
    }
  };
};
