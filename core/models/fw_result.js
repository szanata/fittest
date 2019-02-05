const Result = require( './test_parts/result' );
const { std, mean } = require( '../utils/math' );

const testWasRetryedWithSuccess = ( hash, tests ) =>
  tests.some( t => t.hash === hash && t.result.ok );

module.exports = {
  init() {
    return {
      get et() {
        return this.states.tests.reduce( ( s, test ) => s + test.result.et, 0 ) +
          ( this.states.beforeAll ? this.states.beforeAll.result.et : 0 ) +
          ( this.states.afterAll ? this.states.afterAll.result.et : 0 );
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
      },
      consolidateStatistics() {
        const stepsTimes = this.states.tests.map( t => t.steps.map( s => s.result.et || 0 ) )
          .reduce( (arr, v) => arr.concat( v ), [] ).filter( v => v >= 0 );
        const testsTimes = this.states.tests.map( t => t.result.et ).filter( v => v >= 0 );
        return {
          steps: {
            std: std( stepsTimes ),
            mean: mean( stepsTimes )
          },
          tests: {
            std: std( testsTimes ),
            mean: mean( testsTimes )
          }
        } 
      }
    };
  }
};
