const validateType = require( '../utils/validators/type' );
const { SimpleHooks, SerialHooks, ConditionalHooks } = require( './types' );

module.exports = {
  init( env, test ) {
    const testEnv = { env };

    const hooksTypes = Object.values( SimpleHooks ).concat( Object.values( SerialHooks ) );
    hooksTypes.forEach( type => {
      testEnv[type] = fn => {
        validateType( fn, 'function', `Hook "${type}" parameter should be a function` );
        test.addHook( type, fn );
      };
    } );

    testEnv.step = ( name, fn ) => {
      validateType( name, 'string', 'Step first parameter should be a string' );
      validateType( fn, 'function', 'Step second parameter should be a function' );

      const hash = test.addStep( name, fn );
      return {
        undo( undoFn ) {
          validateType( undoFn, 'function', 'Undo parameter should be a function' );

          test.addHook( ConditionalHooks.undo, undoFn, hash );
          return null;
        }
      };
    };

    return testEnv;
  }
};
