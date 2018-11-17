const Result = require( './test_parts/result' );

const testWasRetryedWithSuccess = ( hash, tests ) =>
  tests.some( t => t.hash === hash && t.result.ok );

module.exports = {
  init() {
    return {
      get et() {
        return this.states.tests.reduce( ( s, test ) => s + test.result.et, 0 )
          + ( this.states.beforeAll ? this.states.beforeAll.result.et : 0 )
          + ( this.states.afterAll ? this.states.afterAll.result.et : 0 );
      },
      get ok() {
        return this.testsResult.ok &&
          ( this.states.beforeAll ? this.states.beforeAll.result.ok : true ) &&
          ( this.states.afterAll ? this.states.afterAll.result.ok : true );
      },
      get testsResult() {
        const tests = this.states.tests;
        const ok = tests.every( test => test.result.ok || testWasRetryedWithSuccess( test.hash, tests ) );
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
