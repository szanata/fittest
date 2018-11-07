const TimeoutError = require( '../../models/errors/timeout_error' );

module.exports = {
  start( t ) {
    const timeout = setTimeout( () => {
      throw new TimeoutError();
    }, t );
    return {
      stop() {
        clearTimeout( timeout );
      }
    };
  }
};
