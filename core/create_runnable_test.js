module.exports = ( test, env, logger ) => async ( ) => {
  const ctx = test.createContext ? test.createContext() : {};
  let pass = true;

  // exec test
  try {
    await test.exec( env, ctx, logger );
  } catch ( err ) {
    logger.error( err.message, err.stack );
    pass = false;
  }

  // rollback test
  try {
    await test.rollback( env, ctx, logger );
  } catch ( err ) {
    logger.error( err.message, err.stack );
    pass = false;
  }

  return pass;
};
