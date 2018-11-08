const Hook = require( './test_hook' );
const Step = require( './test_step' );
const TestState = require( './test_state' );
const Result = require( './result' );
const { SimpleHooks, SerialHooks, ConditionalHooks } = require( './types' );

describe( 'Test State Spec', () => {
  it( 'Should add a step and return its hash', () => {
    const testState = TestState.init();
    const fn = () => 'foo';
    const name = 'Foo';

    const hash = testState.addStep( name, fn );
    expect( testState.steps.length ).toBe( 1 );
    expect( hash ).toMatch( /\d+/ );
    expect( testState.steps[0].serialize() ).toEqual( Step.init( hash, name, fn ).serialize() );
  } );

  describe( 'Hooks', () => {
    it( 'Should add a before hooks', () => {
      const testState = TestState.init();
      const fn = () => 'bar';

      testState.addHook( SimpleHooks.before, fn );

      expect( testState.beforeHooks.length ).toBe( 1 );
      expect( testState.beforeHooks[0].serialize() ).toEqual( Hook.init( SimpleHooks.before, fn ).serialize() );
    } );

    it( 'Should add a after hooks', () => {
      const testState = TestState.init();
      const fn = () => 'bar';

      testState.addHook( SimpleHooks.after, fn );

      expect( testState.afterHooks.length ).toBe( 1 );
      expect( testState.afterHooks[0].serialize() ).toEqual( Hook.init( SimpleHooks.after, fn ).serialize() );
    } );

    it( 'Should add a serial hook to each step inside', () => {
      const testState = TestState.init();
      const fn = () => 'foo';
      const hookFn = () => 'bar';
      const name = 'Foo';

      testState.addStep( name, fn );
      testState.addHook( SerialHooks.beforeEach, hookFn );

      expect( testState.steps[0].hooks[0].serialize() )
        .toEqual( Hook.init( SerialHooks.beforeEach, hookFn ).serialize() );
    } );
  } );

  describe( 'Steps', () => {
    it( 'Should add a undo hook to a step', () => {
      const testState = TestState.init();
      const hookFn = () => 'bar';
      const step1Fn = () => 'step 1';
      const step2Fn = () => 'step 2';
      const step1Name = 'Step 1';
      const step2Name = 'Step 2';

      const hash = testState.addStep( step1Name, step1Fn );
      testState.addStep( step2Name, step2Fn );
      testState.addHook( ConditionalHooks.undo, hookFn, hash );

      expect( testState.steps.length ).toBe( 2 );

      expect( testState.steps.find( s => s.hash === hash ).hooks[0].serialize() )
        .toEqual( Hook.init( ConditionalHooks.undo, hookFn ).serialize() );
    } );

    it( 'Should return a undo tree that is the reverse of the ', () => {
      const testState = TestState.init();
      const hookFn = () => 'bar';
      const step1Fn = () => 'step 1';
      const step2Fn = () => 'step 2';
      const step3Fn = () => 'step 3';
      const step4Fn = () => 'step 4';
      const step5Fn = () => 'step 5';
      const step1Name = 'Step 1';
      const step2Name = 'Step 2';
      const step3Name = 'Step 3';
      const step4Name = 'Step 4';
      const step5Name = 'Step 5';

      const hash1 = testState.addStep( step1Name, step1Fn );
      const hash2 = testState.addStep( step2Name, step2Fn );
      const hash3 = testState.addStep( step3Name, step3Fn );
      testState.addStep( step4Name, step4Fn );
      const hash5 = testState.addStep( step5Name, step5Fn );

      testState.addHook( ConditionalHooks.undo, hookFn, hash1 );
      testState.addHook( ConditionalHooks.undo, hookFn, hash2 );
      testState.addHook( ConditionalHooks.undo, hookFn, hash3 );
      testState.addHook( ConditionalHooks.undo, hookFn, hash5 );

      testState.steps[0].main.result = Result.init( { ok: false } );

      const steps = testState.undoSteps;
      expect( steps.length ).toBe( 3 );
      expect( steps[0].name ).toBe( step5Name );
      expect( steps[1].name ).toBe( step3Name );
      expect( steps[2].name ).toBe( step2Name );
    } );
  } );
} );
