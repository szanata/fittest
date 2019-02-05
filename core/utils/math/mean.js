module.exports = values => values === 0 ? 0 : values.reduce( ( sum, value ) => sum + value, 0 ) / values.length;
