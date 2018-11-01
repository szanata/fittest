module.exports = deepth => 
  new Error()
    .stack
    .split( '\n    at ' )[deepth]
    .match( /\(([^)]+)\)/ )[1].replace( /\/[^/]+(?::\d)*$/ig, '' );
