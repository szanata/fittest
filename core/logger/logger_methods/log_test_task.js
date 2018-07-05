const { br, clear, spc, setSpace } = require( './std_vars' );

module.exports = ( { color, messages = [] } ) => {
  const prefix = `${setSpace( 3 )}└${clear}${spc}${color}`;
  const messageString = messages.map( m => JSON.stringify( m ) ).join(' ');
  const lines = messageString.match( /.{1,80}/g );
  const dspMessage = lines.join( `\n${setSpace( 5 )}` );
  return prefix + dspMessage + clear + br;
};
