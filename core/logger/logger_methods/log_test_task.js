const { br, spc, clear } = require( './std_vars' );

module.exports = ( { color, message = '' } ) => {
  const prefix = `${spc + spc + spc}└${clear}${spc}${color}`;
  const dspMessage = message.length > 80 ? `${message.substring( 0, 80 )}...` : message;
  return prefix + dspMessage + clear + br;
};
