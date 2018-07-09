module.exports = {
  exec( env, ctx, logger ) {
    logger.log( 'This is just a simple exec', new Error().stack );
  }
};
