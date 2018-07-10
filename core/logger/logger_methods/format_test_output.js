const { br, clear, spc, setSpace } = require( './std_vars' );

module.exports = ( { color, messages = [] } ) => {
  const prefix = `${setSpace( 3 )}└${clear}${spc}${color}`;

  const lines = messages
    .map( m => JSON.stringify( m ) ) // parse every message
    .map( m => m.replace( /^"|"$/g, '' ) ) // remove wrap around quotes (when parsing strings as json)
    .join( ' ' ) // join to keep messages in the same line
    .split( '\\n' ) // split those that have \n into lines
    .map( m => m.match( /.{1,80}/g ) ) // further break lines into lines with less than 80 chars
    .reduce( ( arr, m ) => arr.concat( m ), [] ); // flatten

  const dspMessage = lines.join( `${br}${setSpace( 5 )}` );
  return prefix + dspMessage + clear + br;
};
