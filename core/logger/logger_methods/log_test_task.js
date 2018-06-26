const { br, clear, spc, setSpace } = require( './std_vars' );

module.exports = ( { color, message = '' } ) => {
  const prefix = `${setSpace( 3 )}└${clear}${spc}${color}`;
  const messagesLines = message.match( /.{1,80}/g );
  const dspMessage = messagesLines.join( `\n${setSpace( 5 )}` );
  return prefix + dspMessage + clear + br;
};
