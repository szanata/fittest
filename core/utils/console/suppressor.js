const supressedMethods = [ 'log', 'error', 'warn', 'info', 'trace' ];

module.exports = {
  init() {
    const messages = [];
    const consoleProxy = new Proxy( console, {
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

    // This method works on older nodes too, like 8.x, where the global.console
    // is only a getter
    delete global.console;

    Reflect.defineProperty( global, 'console', {
      value: consoleProxy 
    });
  }
};
