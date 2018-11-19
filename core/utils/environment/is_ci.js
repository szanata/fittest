module.exports = () => (!!process.env.CI
  || !!process.env.CONTINUOUS_INTEGRATION
  || !!process.env.BUILD_NUMBER
  || !!process.env.TRAVIS);
