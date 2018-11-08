const Runnable = require( './runnable' );

module.exports = {
  init( type, fn ) {
    const runnable = Runnable.init( fn );
    return Object.assign( Object.create( runnable ), {
      type,
      serialize() {
        return Object.assign( runnable.serialize.call( this ), { type: this.type } );
      }
    } );
  }
};
