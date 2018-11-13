const Hook = require( './test_parts/hook' );
const Step = require( './test_parts/step' );
const Result = require( './test_parts/result' );
const Test = require( './test' );
const { SimpleHooks, SerialHooks, ConditionalHooks } = require( './types' );

const path = '/cool_test.js';

describe( 'Test State Spec', () => {
  it( 'Should add a step and return its hash', () => {
    const test = Test.init( path );
    const fn = () => 'foo';
    const name = 'Foo';

    const hash = test.addStep( name, fn );
    expect( test.steps.length ).toBe( 1 );
    expect( hash ).toMatch( /\d+/ );
    expect( test.steps[0].serialize() ).toEqual( Step.init( hash, name, fn ).serialize() );
  } );

  describe( 'Hooks', () => {
    it( 'Should add a before hooks', () => {
      const test = Test.init( path );
      const fn = () => 'bar';

      test.addHook( SimpleHooks.before, fn );

      expect( test.beforeHooks.length ).toBe( 1 );
      expect( test.beforeHooks[0].serialize() ).toEqual( Hook.init( SimpleHooks.before, fn ).serialize() );
    } );

    it( 'Should add a after hooks', () => {
      const test = Test.init( path );
      const fn = () => 'bar';

      test.addHook( SimpleHooks.after, fn );

      expect( test.afterHooks.length ).toBe( 1 );
      expect( test.afterHooks[0].serialize() ).toEqual( Hook.init( SimpleHooks.after, fn ).serialize() );
    } );

    it( 'Should add a serial hook to each step inside', () => {
      const test = Test.init( path );
      const fn = () => 'foo';
      const hookFn = () => 'bar';
      const name = 'Foo';

      test.addStep( name, fn );
      test.addHook( SerialHooks.beforeEach, hookFn );

      expect( test.steps[0].hooks[0].serialize() )
        .toEqual( Hook.init( SerialHooks.beforeEach, hookFn ).serialize() );
    } );
  } );

  describe( 'Steps', () => {
    it( 'Should add a undo hook to a step', () => {
      const test = Test.init( path );
      const hookFn = () => 'bar';
      const step1Fn = () => 'step 1';
      const step2Fn = () => 'step 2';
      const step1Name = 'Step 1';
      const step2Name = 'Step 2';

      const hash = test.addStep( step1Name, step1Fn );
      test.addStep( step2Name, step2Fn );
      test.addHook( ConditionalHooks.undo, hookFn, hash );

      expect( test.steps.length ).toBe( 2 );

      expect( test.steps.find( s => s.hash === hash ).hooks[0].serialize() )
        .toEqual( Hook.init( ConditionalHooks.undo, hookFn ).serialize() );
    } );

    describe( 'Undoing steps', () => {
      it( 'Should return a undo hooks from the invoked non broken steps in the reverse order of their registration', () => {
        const test = Test.init( path );
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

        const hash1 = test.addStep( step1Name, step1Fn );
        const hash2 = test.addStep( step2Name, step2Fn );
        const hash3 = test.addStep( step3Name, step3Fn );
        test.addStep( step4Name, step4Fn );
        const hash5 = test.addStep( step5Name, step5Fn );

        test.addHook( ConditionalHooks.undo, hookFn, hash1 );
        test.addHook( ConditionalHooks.undo, hookFn, hash2 );
        test.addHook( ConditionalHooks.undo, hookFn, hash3 );
        test.addHook( ConditionalHooks.undo, hookFn, hash5 );

        test.steps[1].main.invoked = true;
        test.steps[4].main.invoked = true;

        test.steps[0].main.result = Result.init( { ok: false } );

        const steps = test.undoSteps;
        expect( steps.length ).toBe( 2 );
        expect( steps[0].name ).toBe( step5Name );
        expect( steps[1].name ).toBe( step2Name );
      } );
    } );
  } );
} );
