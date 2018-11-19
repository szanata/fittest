module.exports = ( v, possible, type, msg ) => {
  if ( !possible.includes( v ) ) {
    throw new TypeError( msg );
  }
};
