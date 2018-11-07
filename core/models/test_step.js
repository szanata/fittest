const TestBitResult = require( './test_bit_result' );
const { SerialHooks, ConditionalHooks } = require( './types' );

module.exports = {
  init( hash, name, fn ) {
    return {
      hash,
      name,
      fn,
      hooks: [],
      result: TestBitResult.init(),
      get beforeHooks( ) {
        return this.hooks.filter( h => h.type === SerialHooks.beforeEach );
      },
      get afterHooks( ) {
        return this.hooks.filter( h => h.type === SerialHooks.afterEach );
      },
      get undoHook( ) {
        return this.hooks.find( h => h.type === ConditionalHooks.undo );
      },
      get ok( ) {
        return this.result.ok && this.hooks.every( h => h.ok );
      },
      get hooksEt( ) {
        return this.hooks.reduce( ( s, h ) => h.result.et + s, 0 );
      },
      serialize() {
        return {
          name: this.name,
          result: this.result.serialize(),
          hooksEt: this.hooksEt,
          hooks: this.hooks.map( h => h.serialize() )
        };
      }
    };
  }
};
