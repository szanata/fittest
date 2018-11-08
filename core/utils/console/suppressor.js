const supressedMethods = [ 'log', 'error', 'warn', 'info', 'trace' ];

module.exports = {
  init() {
    const messages = [];
    global.console = new Proxy( console, {
      get( target, prop ) {
        if ( supressedMethods.includes( prop ) ) {
          return ( ...args ) => {
            messages.push( { method: prop, args } );
          };
        }
        if ( prop === 'flush' ) {
          return () => messages.splice( 0 );
        }
        return target[prop];
      }
    } );
  }
};
