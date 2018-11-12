fittest( 'Logger savvy test', test => {

  test.before( () => {
    console.info( 'Before logs' );
  } );

  test.beforeEach( () => {
    console.info( 'Before each logs' );
  } );

  test.step( 'Log methods', () => {
    console.error( 'This is an error!' );
    console.warn( 'This is a warn!' );
    console.log( 'This is a log!' );
    console.info( 'This is an info!' );
  } );

  test.step( 'Logs with objects', () => {
    console.log( {
      model: 'V40',
      maker: 'Volvo',
      type: 'SUV',
      engine: {
        cylinders: 5,
        displacement: 2500,
        intake: 'turbo',
        layout: 'i'
      }
    } );
  } );

  test.afterEach( () => {
    console.info( 'After each logs' );
  } );

  test.after( () => {
    console.info( 'After logs' );
  } );
} );
