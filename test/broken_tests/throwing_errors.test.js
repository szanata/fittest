fittest( 'Throw errors test', test => {
  test.step( 'Throwing errors!', () => {
    throw new Error('Something hard happened');
  });
});
