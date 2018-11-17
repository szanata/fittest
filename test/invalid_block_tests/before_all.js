const axios = require( 'axios' );

module.exports = async ( ) => {
  await axios.get( 'https://google.com' );
  await axios.get( 'https://github.com' );
};
