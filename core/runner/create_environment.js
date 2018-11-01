module.exports = ( id, opts, event ) => ( {
  serverUrl: `${opts.features.serverUrl}/${id}`,
  asyncEvent: event.once
} );
