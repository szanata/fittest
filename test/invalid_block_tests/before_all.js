const axios = require( 'axios' );

module.exports = async ( env, ctx ) => {
  await axios.get( 'https://google.com' );
  await axios.get( 'https://github.com' );
};
