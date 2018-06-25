const http = require( 'http' );

const parseBody = body => {
  const stringBody = Buffer.concat( body ).toString();
  try {
    return stringBody ? JSON.parse( stringBody ) : null;
  } catch ( err ) {
    return stringBody;
  }
};

const serializeRequest = req => ( {
  url: req.url,
  headers: req.headers
} );

const makeHandle = emitter => ( req, res ) => {
  const body = [];
  req.on( 'data', chunk => body.push( chunk ) ).on( 'end', () => {
    const processId = req.url.split( '/' )[1];
    const parsedBody = parseBody( body );
    const reqArg = serializeRequest( req );
    if ( req.method === 'POST' ) {
      emitter.emit( 'message', { eventName: 'http-post', processId, args: { req: reqArg, body: parsedBody } } );
    }
    if ( req.method === 'GET' ) {
      emitter.emit( 'message', { eventName: 'http-get', processId, args: { req: reqArg } } );
    }
    res.end( );
  } );
};

module.exports = ( port, emitter ) => http.createServer( makeHandle( emitter ) ).listen( port );

