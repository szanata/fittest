module.exports = {
  init( et =  0, err = null ) {
    return {
      get ok() {
        return !err;
      },
      et,
      err
    };
  }
};
