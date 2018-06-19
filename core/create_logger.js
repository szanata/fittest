const bold = '\x1b[1m';
const dim = '\x1b[2m';
const clear = '\x1b[0m';
const br = '\n';
const red = '\x1b[31m';
const blue = '\x1b[34m';
const green = '\x1b[32m';
const white = '\x1b[37m';
const spc = ' ';

const logSub = ( stack, { label, text } ) => {
  const reason = `${br + dim + spc}${label}${br}` +
                 `${spc}───────${clear}`;
  let info = text.split( '\n' ).slice( 0, 5 ).join( '\n' );
  if ( info !== text ) {
    info += '\n... [truncated]';
  }
  stack.push( reason + br + spc + info + br );
};

const logMain = ( stack, { color, label, message = '', weight = bold } ) => {
  const head = `${weight + spc + color}┏━━━━━━┓${clear}`;
  const body = `${weight + spc + color}┃ ${label} ┃${clear}${spc}`;
  const foot = `${weight + spc + color}┗━━━━━━┛${clear}`;
  const dspMessage = message.length > 80 ? `${message.substring( 0, 80 )}...` : message;
  stack.push( head + br + body + bold + dspMessage + clear + br + foot );
};

module.exports = () => {
  const stack = [];

  return {
    get stack() {
      return stack;
    },
    flow: message => logMain( stack, { color: blue, label: 'Flow', message } ),
    step: message => logMain( stack, { color: white, label: 'Step', message, weight: dim } ),
    ok: message => logMain( stack, { color: green, label: ' Ok ', message } ),
    pass: message => logMain( stack, { color: green, label: 'Pass', message } ),
    fail: message => logMain( stack, { color: red, label: 'Fail', message } ),
    error: ( message, details ) => {
      logMain( stack, { color: red, label: 'Err!', message, weight: dim } );
      if ( details ) {
        logSub( stack, { label: 'Details', text: details } );
      }
    }
  };
};
