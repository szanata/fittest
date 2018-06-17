module.exports = async ( env, ctx, logger ) => {
  const { ok, step, flow } = logger;
  const { serverUrl } = env;

  flow( 'Starting some test.' );
  step( `Your test server url is ${serverUrl}` );

  step( 'Doing some stuff' );
  ok( 'Sutff done.' );


  step( 'Awaiting asyn event' );
  const someData = await env.listen( 'http-post' );
  ok( `Async event done, your data is: ${someData}` );

  ok( 'Test done.' );
};
