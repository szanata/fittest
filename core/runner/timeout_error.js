module.exports = class TimeoutError extends Error {
  constructor( ...args ) {
    super( ...args );
    this.name = 'TimeoutError';
  }
};
