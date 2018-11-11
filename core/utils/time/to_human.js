module.exports = ms => Object
  .entries( {
    h: 1000 * 60 * 60,
    m: 1000 * 60,
    s: 1000
  } ).reduce( ( obj, t ) => {
    const time = Math.floor( obj.rest / t[1] );
    obj.rest = obj.rest % t[1];
    if ( time > 0 ) {
      obj.formatted = obj.formatted + `${time}${t[0]}`;
    }
    return obj;
  }, { rest: ms, formatted: '' } ).formatted;
