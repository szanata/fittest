const validateType = require( '../utils/validators/type' );

module.exports = {
  init( testInterface, test ) {
    return ( name, fn ) => {
      validateType( name, 'string', 'fittest first parameter should be a string' );
      validateType( fn, 'function', 'fittest second parameter should be a function' );

      test.name = name;

      fn( testInterface );
    };
  }
};
