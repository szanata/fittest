const validateType = require( '../utils/validators/type' );
const { SimpleHooks, SerialHooks, ConditionalHooks } = require( './types' );

module.exports = {
  init( env, testState ) {
    const test = { env };

    const hooksTypes = Object.values( SimpleHooks ).concat( Object.values( SerialHooks ) );
    hooksTypes.forEach( type => {
      test[type] = fn => {
        validateType( fn, 'function', `Hook "${type}" parameter should be a function` );
        testState.addHook( type, fn );
      };
    } );

    test.step = ( name, fn ) => {
      validateType( name, 'string', 'Step first parameter should be a string' );
      validateType( fn, 'function', 'Step second parameter should be a function' );

      const hash = testState.addStep( name, fn );
      return {
        undo( undoFn ) {
          validateType( undoFn, 'function', 'Undo parameter should be a function' );

          testState.addHook( ConditionalHooks.undo, undoFn, hash );
          return null;
        }
      };
    };

    return test;
  }
};
