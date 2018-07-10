const format = require( './logger_methods/format_test_output' );
const { blue, green, red, white, yellow } = require( './logger_methods/std_vars' );

module.exports = () => {
  const buffer = [];

  const methodsMeta = [
    [ 'flow', blue ],
    [ 'step', white ],
    [ 'warn', yellow ],
    [ 'info', blue ],
    [ 'log', white ],
    [ 'ok', green ],
    [ 'error', red ]
  ];

  const methods = methodsMeta.reduce( ( obj, meta ) => Object.assign( { }, obj, {
    [meta[0]]: ( ...args ) => buffer.push( format( { color: meta[1], messages: args } ) )
  } ), {
    get output() { return buffer; }
  } );

  Object.freeze( methods );

  return methods;
};
