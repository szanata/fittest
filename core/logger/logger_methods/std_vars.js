module.exports = {
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  clear: '\x1b[0m',
  br: '\n',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
  spc: ' ',
  setSpace: x => new Array( x ).fill( ' ' ).join( '' )
};
