module.exports = {
  init() {
    return {
      context: [],
      testsPaths: [],
      blockPaths: {
        beforeAll: null,
        afterAll: null
      },
      get tasksCount() {
        return this.testsPaths.length +
          ( this.blockPaths.beforeAll ? 1 : 0 ) +
          ( this.blockPaths.afterAll ? 1 : 0 );
      },
      displaySuccessOutput: false,
      timeoutTime: 300000,
      relativeDir: null,
      retries: 0
    };
  }
};