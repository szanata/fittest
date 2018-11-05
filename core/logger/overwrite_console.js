const format = require( './logger_methods/format_test_output' );
const { blue, green, red, white, yellow } = require( './logger_methods/std_vars' );

const methods = {
  warn: yellow,
  info: blue,
  log: white,
  ok: green,
  error: red
};

module.exports = () => {
  const messages = [];
  global.console = new Proxy( console, {
    get( target, prop ) {
      if ( Object.keys( methods ).includes( prop ) ) {
        return ( ...args ) => {
          messages.push( format( { color: methods[prop], messages: args } ) );
        };
      }
      if ( prop === 'output' ) {
        return messages;
      }
      return target[prop];
    }
  } );
};
