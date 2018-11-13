const genId = require( '../utils/data/gen_id' );
const Hook = require( './test_parts/hook' );
const Step = require( './test_parts/step' );
const Result = require( './test_parts/result' );
const { SimpleHooks, SerialHooks, ConditionalHooks } = require( './types' );

module.exports = {
  init( path ) {
    const steps = [];
    const hooks = [];
    const additionalStepHooks = [];
    const hash = Buffer.from( path ).toString( 'base64' );

    return {
      get beforeHooks() {
        return hooks.filter( h => h.type === SimpleHooks.before );
      },
      get afterHooks() {
        return hooks.filter( h => h.type === SimpleHooks.after );
      },
      get steps( ) {
        return steps;
      },
      get hash( ) {
        return hash;
      },
      invoked: false,
      logs: [],
      name: null,
      err: null,
      retries: 0,
      get undoSteps( ) {
        return steps.slice().reverse()
          .filter( s => s.main.invoked )
          .filter( s => s.main.result.ok )
          .filter( s => s.undoHook );
      },
      get result() {
        const ok = !this.err && hooks.concat( steps )
          .every( r => r.result.ok );

        const et = hooks.concat( steps )
          .filter( r => r.invoked )
          .reduce( ( sum, r ) => r.result.et + sum, 0 );

        return Result.init( { ok, et, err: this.err } );
      },
      addStep( name, fn ) {
        const stepHash = genId();
        const step = Step.init( stepHash, name, fn );
        steps.push( step );
        additionalStepHooks.forEach( hook => step.hooks.push( hook ) );
        return stepHash;
      },
      addHook( type, fn, stepHash ) {
        if ( type === ConditionalHooks.undo ) {
          const step = steps.find( s => s.hash === stepHash );
          step.hooks.push( Hook.init( type, fn ) );

        } else if ( Object.values( SerialHooks ).includes( type ) ) {
          const hook = Hook.init( type, fn );
          steps.forEach( step => step.hooks.push( hook ) );
          additionalStepHooks.push( hook );

        } else if ( Object.values( SimpleHooks ).includes( type ) ) {
          hooks.push( Hook.init( type, fn ) );
        }
      },
      serialize( ) {
        return {
          path,
          name: this.name || path,
          logs: this.logs,
          invoked: this.invoked,
          steps: steps.map( s => s.serialize() ),
          beforeHooks: this.beforeHooks.map( h => h.serialize() ),
          afterHooks: this.afterHooks.map( h => h.serialize() ),
          hooks: hooks.map( h => h.serialize() ),
          result: this.result.serialize()
        };
      }
    };
  }
};
