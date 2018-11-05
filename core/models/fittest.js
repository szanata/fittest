const validateType = require( '../utils/validators/type' );

module.exports = {
  init( testInterface, testState ) {
    return ( name, fn ) => {
      validateType( name, 'string', 'fittest first parameter should be a string' );
      validateType( fn, 'function', 'fittest second parameter should be a function' );

      testState.name = name;

      fn( testInterface );
    };
  }
};
