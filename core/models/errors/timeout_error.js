module.exports = class TimeoutError extends Error {
  constructor( time ) {
    super();
    this.name = 'TimeoutError';
    this.stack = `TimeoutError (${time}ms)`;
  }
};
