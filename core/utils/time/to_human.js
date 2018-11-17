module.exports = ms => Object
  .entries( {
    h: 1000 * 60 * 60,
    m: 1000 * 60,
    s: 1000,
    ms: 1
  } ).reduce( ( obj, t, i, arr ) => {
    const time = Math.floor( obj.rest / t[1] );
    obj.rest = obj.rest % t[1];
    if ( time > 0 || i === (arr.length - 1) ) {
      obj.f = obj.f + `${time}${t[0]}`;
    }
    return obj;
  }, { rest: ms, f: '' } ).f;
