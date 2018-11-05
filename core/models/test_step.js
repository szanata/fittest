const { DirectHooks, ConditionalHooks }  = require( './types' );

module.exports = {
  init( hash, name, fn ) {
    return {
      name,
      fn,
      hooks: [],
      result: { },
      get beforeHooks( ) {
        return this.hooks.filter( h => h.type === DirectHooks.beforeEach );
      },
      get afterHooks( ) {
        return this.hooks.filter( h => h.type === DirectHooks.afterEach );
      },
      get undoHook( ) {
        return this.hooks.find( h => h.type === ConditionalHooks.undo );
      },
      get ok( ) {
        return this.result.ok && this.hooks.every( h => h.ok );
      }
    };
  }
};
