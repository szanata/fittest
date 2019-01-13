module.exports = ( values, type, msg ) => {
  if ( values.every( v => typeof v !== type ) ) {
    throw new TypeError( msg );
  }
};
