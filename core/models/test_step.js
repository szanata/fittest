const Result = require( './result' );
const { SerialHooks, ConditionalHooks } = require( './types' );
const Runnable = require( './runnable' );

module.exports = {
  init( hash, name, fn ) {
    return {
      hash,
      name,
      main: Runnable.init( fn ),
      hooks: [],
      get beforeHooks( ) {
        return this.hooks.filter( h => h.type === SerialHooks.beforeEach );
      },
      get afterHooks( ) {
        return this.hooks.filter( h => h.type === SerialHooks.afterEach );
      },
      get undoHook( ) {
        return this.hooks.find( h => h.type === ConditionalHooks.undo );
      },
      get result( ) {
        const et = this.hooks.reduce( ( s, hook ) => hook.result.et + s, 0 ) +
          this.main.result.et;
        const ok = this.main.result.ok && this.hooks.every( hook => hook.result.ok );
        return Result.init( { ok, et } );
      },
      serialize() {
        return {
          name: this.name,
          main: this.main.serialize(),
          result: this.result.serialize(),
          beforeHooks: this.beforeHooks.map( h => h.serialize() ),
          afterHooks: this.afterHooks.map( h => h.serialize() ),
          undoHook: this.undoHook ? this.undoHook.serialize() : null,
          hooks: this.hooks.map( h => h.serialize() )
        };
      }
    };
  }
};
