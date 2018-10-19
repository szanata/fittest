const { br, spc, clear, black } = require( './std_vars' );

module.exports = ( { color, label, message = '' } ) => {
  const prefix = spc + color;
  const line = `${prefix}${black} ${label} ${clear}${spc}`;
  const dspMessage = message.length > 80 ? `${message.substring( 0, 80 )}...` : message;
  return line + dspMessage + clear + br;
};
