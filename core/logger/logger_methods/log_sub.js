const { br, spc, clear, dim } = require( './std_vars' );

module.exports = ( { label, text } ) => {
  const reason = `${br + dim + spc}${label}${br}` +
                 `${spc}───────${clear}`;
  let info = text.split( '\n' ).slice( 0, 5 ).join( '\n' );
  if ( info !== text ) {
    info += '\n... [truncated]';
  }
  return reason + br + spc + info + br;
};
