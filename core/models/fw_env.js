module.exports = {
  init() {
    return {
      context: {},
      testsPaths: {},
      blockPaths: {
        beforeAll: null,
        afterAll: null
      },
      displaySuccessOutput: false,
      timeoutTime: 300000,
      relativeDir: null,
      retries: 0
    };
  }
};