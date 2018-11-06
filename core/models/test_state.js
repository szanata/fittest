const genId = require( '../utils/data/gen_id' );
const Hook = require( './test_hook' );
const Step = require( './test_step' );
const { DirectHooks, ConditionalHooks } = require( './types' );

module.exports = {
  init( ) {
    const steps = [];
    const hooks = [];
    let name;

    return {
      get beforeHooks() {
        return hooks.filter( h => h.type === DirectHooks.before );
      },
      get afterHooks() {
        return hooks.filter( h => h.type === DirectHooks.after );
      },
      get steps( ) {
        return steps;
      },
      set name( _name ) {
        name = _name;
      },
      get undoSteps( ) {
        return steps.reverse().filter( s => s.result.ok );
      },
      get ok( ) {
        const hooksOk = hooks.every( h => h.ok );
        const stepsOk = steps.every( s => s.ok );
        return hooksOk && stepsOk;
      },
      get et( ) {
        return this.hooks.reduce( ( sum, h ) => h.result.et + sum, 0 ) +
          this.steps.reduce( ( sum, s ) => s.result.et + sum + s.hooksEt, 0 );
      },
      addStep( name, fn ) {
        const hash = genId();
        steps.push( Step.init( hash, name, fn ) );
        return hash;
      },
      addHook( type, fn, stepHash ) {
        if ( type === ConditionalHooks.undo ) {
          const step = steps.find( s => s.hash === stepHash );
          step.hooks.push( Hook.init( type, fn ) );
        } else if ( [ DirectHooks.beforeEach, DirectHooks.afterEach ].includes( type ) ) {
          steps.forEach( step => {
            step.hooks.push( Hook.init( type, fn ) );
          } );
        } else if ( [ DirectHooks.before, DirectHooks.after ].includes( type ) ) {
          hooks.push( Hook.init( type, fn ) );
        }
      },
      serialize( ) {
        return {
          name,
          steps: this.steps.map( s => s.serialize() ),
          hooks: this.hooks.map( h => h.serialize() ),
          result: {
            ok: this.ok,
            et: this.et
          }
        };
      }
    };
  }
};
