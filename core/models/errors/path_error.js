module.exports = class PathError extends Error {
  constructor( ...args ) {
    super( ...args );
    this.name = 'PathError';
  }
};
