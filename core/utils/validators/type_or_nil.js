module.exports = ( v, type, msg ) => {
  if ( typeof v !== type && ![ null, undefined ].includes( v ) ) {
    throw new TypeError( msg );
  }
};
