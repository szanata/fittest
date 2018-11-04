module.exports = ( id, opts, emitter ) => ( {
  serverUrl: `${opts.features.serverUrl}/${id}`,
  asyncEvent: emitter.once
} );
