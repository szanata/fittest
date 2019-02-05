const mean = require( './mean' );

module.exports = values => {
  const avg = mean( values );
  const squareDiffs = values.map( value => Math.pow( value - avg, 2 ) );
  const avgSquareDiff = mean( squareDiffs );

  return Math.sqrt( avgSquareDiff );
};
