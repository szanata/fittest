const typeValidator = require( '../utils/validators/type' );
const typeOrNilValidator = require( '../utils/validators/type_or_nil' );

module.exposts = userOpts => {
  typeValidator( userOpts, 'object', 'Option "testsDir" should be an object.' );
  typeValidator( userOpts.testsDir, 'string', 'Option "testsDir" should be a string.' );
  typeOrNilValidator( userOpts.beforeAll, 'string', 'Option "beforeAll" should be a string.' );
  typeOrNilValidator( userOpts.afterAll, 'string', 'Option "afterAll" should be a string.' );
  typeOrNilValidator( userOpts.retries, 'number', 'Option "retries" should be a string.' );
  typeOrNilValidator( userOpts.timeoutTime, 'number', 'Option "timeoutTime" should be a number.' );
};
