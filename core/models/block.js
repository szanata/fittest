const Runnable = require( './test_parts/runnable' );

module.exports = {
  init( fn ) {
    const runnable = Runnable.init( fn );
    return Object.assign( Object.create( runnable ), {
      logs: [],
      context: [],
      serialize( ) {
        return Object.assign( runnable.serialize.call( this ), {
          logs: this.logs,
          context: this.context
        } );
      }
    } );
  }
};
