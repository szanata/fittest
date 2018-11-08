const genId = require( '../utils/data/gen_id' );
const Hook = require( './test_hook' );
const Step = require( './test_step' );
const { SimpleHooks, SerialHooks, ConditionalHooks } = require( './types' );
const Result = require( './result' );

module.exports = {
  init( path ) {
    const steps = [];
    const hooks = [];
    const additionalStepHooks = [];

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
      logs: [],
      name: null,
      err: null,
      get undoSteps( ) {
        return steps.slice().reverse().filter( s => s.main.result.ok ).filter( s => s.undoHook );
      },
      get result() {
        const ok = !this.err && hooks.every( h => h.result.ok ) && steps.every( s => s.result.ok );
        const et = hooks.reduce( ( sum, hook ) => sum + hook.result.et, 0 ) +
          steps.reduce( ( sum, step ) => sum + step.result.et, 0 );
        return Result.init( { ok, et, err: this.err } );
      },
      addStep( name, fn ) {
        const hash = genId();
        const step = Step.init( hash, name, fn );
        steps.push( step );
        additionalStepHooks.forEach( hook => step.hooks.push( hook ) );
        return hash;
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
          name: this.name,
          logs: this.logs,
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
