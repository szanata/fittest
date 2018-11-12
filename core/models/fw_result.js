const Result = require( './result' );

const testWasRetryedWithSuccess = ( hash, tests ) => 
  tests.some( t => t.hash === hash && t.result.ok );

module.exports = {
  init() {
    const testStates = [];
    return {
      et: 0,
      addTestState( state ) {
        testStates.push( state );
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
        get tests() {
          return testStates;
        },
        afterAll: null
      }
    };
  }
};
