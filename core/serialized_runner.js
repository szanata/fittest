module.exports = fns =>
  fns.reduce(
    ( promise, fn ) =>
      promise.then( results => fn( ).then( r => results.concat( r ) ) )
    , Promise.resolve( [] )
  );
