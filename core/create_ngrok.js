const ngrok = require( 'ngrok' );

module.exports = async port => ngrok.connect( port );
