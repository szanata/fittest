module.exports = ( mainEmitter, emitters ) => {
  mainEmitter.on( 'any', ( { emitterId, eventName, args } ) => {
    emitters.forEach( emitter => {
      if ( emitter.id === emitterId ) {
        emitter.emit( eventName, args );
      }
    } );
  } );
};
