const { bold, br, spc, clear } = require( './std_vars' );

module.exports = ( { color, label, message = '', weight = bold } ) => {
  const prefix = weight + spc + color;
  const head = `${prefix}┏━━━━━━┓${clear}`;
  const body = `${prefix}┃ ${label} ┃${clear}${spc}`;
  const foot = `${prefix}┗━━━━━━┛${clear}`;
  const dspMessage = message.length > 80 ? `${message.substring( 0, 80 )}...` : message;
  return head + br + body + bold + dspMessage + clear + br + foot;
};
