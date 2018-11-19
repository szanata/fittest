fittest( 'Async event timeout', test => {
  test.step( 'This should break as this event never happens in 10ms', async () => {
    await test.env.asyncEvent( 'http-get', 10 );
  });
});
