module.exports = async ( test, env, logger ) => {
  const ctx = test.createContext ? test.createContext() : {};
  let pass = true;

  if ( !test.exec ) {
    return pass;
  }

  // exec test
  try {
    await test.exec( env, ctx, logger );
  } catch ( err ) {
    logger.error( err.message, err.stack );
    pass = false;
  }

  if ( !test.rollback ) {
    return pass;
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
