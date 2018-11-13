fittest( 'Async event timeout', test => {
  test.step( 'This should break as this event never happen', async () => {
    await env.asyncEvent( 'foo-bar', 10 );
  });
});
