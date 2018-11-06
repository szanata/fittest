const Hook = require( './test_hook' );
const Step = require( './test_step' );
const TestState = require( './test_state' );
const TestBitResult = require( './test_bit_result' );
const { DirectHooks, ConditionalHooks } = require( './types' );

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
} );
