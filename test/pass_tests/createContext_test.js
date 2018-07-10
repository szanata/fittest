module.exports = {
  createContext( ) {
    return {
      foo: 'bar'
    };
  },

  exec( env, ctx ) {
    if ( ctx.foo !== 'bar' ) {
      throw new Error( 'createContext didnt created any context' );
    }
  }
};
