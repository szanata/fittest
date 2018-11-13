const Hook = require( './hook' );
const Step = require( './step' );
const Result = require( './result' );
const { SerialHooks } = require( '../types' );

describe( 'Test Step Spec', () => {
  it( 'Should create a step with hash, name and main fn', () => {
    const hash = '33434';
    const name = 'Foo';
    const fn = () => 'bar';

    const step = Step.init( hash, name, fn );
    expect( step.hash ).toBe( hash );
    expect( step.name ).toBe( name );
    expect( step.main.fn ).toBe( fn );

  } );

  describe( '.ok', () => {

    it( 'Should return ok when there is no hooks', () => {
      const step = Step.init();
      expect( step.result.ok ).toBe( true );
    } );

    it( 'Should return ok when the main fn result was ok', () => {
      const step = Step.init();
      const result = Result.init();
      step.main.result = result;
      expect( step.result.ok ).toBe( true );
    } );

    it( 'Should return ok when the hooks are ok', () => {
      const step = Step.init();
      const hook = Hook.init( SerialHooks.afterEach, () => {} );
      const result = Result.init();
      hook.result = result;
      step.hooks.push( hook );
      expect( step.result.ok ).toBe( true );
    } );

    it( 'Should return NOT ok when some hooks is not ok', () => {
      const step = Step.init();
      const hook = Hook.init( SerialHooks.afterEach, () => {} );
      const result = Result.init( { ok: false } );
      hook.result = result;
      step.hooks.push( hook );
      expect( step.result.ok ).toBe( false );
    } );
  } );
} );
