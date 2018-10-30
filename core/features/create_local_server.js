const http = require( 'http' );

const parseBody = body => {
  const stringBody = Buffer.concat( body ).toString();
  try {
    return stringBody ? JSON.parse( stringBody ) : null;
  } catch ( err ) {
    return stringBody;
  }
};

const parseQuerystring = qs => decodeURIComponent( qs )
  .split( '&' ).reduce( ( obj, kv ) => {
    const [ key, value ] = kv.split( '=' );
    obj[key] = value;
    return obj;
  }, {} );

const createResponse = ( req, body ) => {
  const [ url, qs ] = req.url.split( '?' );
  const res = {
    url,
    qs: qs ? parseQuerystring( qs ) : {},
    headers: req.headers
  };
  if ( body.length > 0 ) {
    res.body = parseBody( body );
  }
  return res;
};

const getEvent = req => `message_to:${req.url.match( /\/(\d+)/ )[1]}`;

const makeHandle = emitter => ( req, res ) => {
  const body = [];
  req.on( 'data', chunk => body.push( chunk ) ).on( 'end', () => {
    const event = getEvent( req );
    const response = createResponse( req, body );

    if ( req.method === 'POST' ) {
      emitter.emit( event, { name: 'http-post', args: response } );
    }

    if ( req.method === 'GET' ) {
      emitter.emit( event, { name: 'http-get', args: response } );
    }
    res.end( );
  } );
};

module.exports = ( port, emitter ) => http.createServer( makeHandle( emitter ) ).listen( port );
