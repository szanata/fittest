const { br, spc, clear, dim, setSpace } = require( './std_vars' );

module.exports = ( { label, text } ) => {
  const reason = dim + setSpace(3) + label +  br +
                 `${setSpace(3)}───────${clear}`;
  let info = setSpace(2) + text.split( '\n' ).slice( 0, 5 ).join( `\n${setSpace(3)}` );
  if ( info !== text ) {
    info += `\n${setSpace(7)}...\n${setSpace(7)}[truncated]`;
  }
  return reason + br + spc + info + br;
};
