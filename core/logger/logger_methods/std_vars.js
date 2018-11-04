module.exports = {
  bold: '\x1b[1m',
  black: '\x1b[30m',
  dim: '\x1b[2m',
  clear: '\x1b[0m',
  br: '\n',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
  bgYellow: '\x1b[43m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
  bgRed: '\x1b[41m',
  spc: ' ',
  setSpace: x => Array( x ).fill( ' ' ).join( '' )
};
