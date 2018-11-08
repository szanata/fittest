const Result = require( './result' );

module.exports = {
  init() {
    return {
      et: 0,
      get ok() {
        return this.states.tests.every( t => t.result.ok ) &&
          ( this.states.beforeAll ? this.states.beforeAll.result.ok : true ) &&
          ( this.states.afterAll ? this.states.afterAll.result.ok : true );
      },
      get testsResult() {
        const tests = this.states.tests;
        const ok = tests.every( test => test.result.ok );
        const et = tests.reduce( ( s, test ) => s + test.result.et, 0 );
        return Result.init( { ok, et } );
      },
      states: {
        beforeAll: null,
        tests: [],
        afterAll: null
      }
    };
  }
};
