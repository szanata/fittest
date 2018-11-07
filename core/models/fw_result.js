module.exports = {
  init() {
    return {
      et: 0,
      get ok() {
        return this.states.tests.every( b => b.ok ) &&
          ( this.states.beforeAll ? this.states.beforeAll.ok : true ) &&
          ( this.states.afterAll ? this.states.afterAll.ok : true );
      },
      states: {
        beforeAll: null,
        tests: [],
        afterAll: null
      }
    };
  }
};
