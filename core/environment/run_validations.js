const typeValidator = require( '../utils/validators/type' );
const typeOrNilValidator = require( '../utils/validators/type_or_nil' );
const multiTypeValidator = require( '../utils/validators/multi_type' );

module.exports = userOpts => {
  typeValidator( userOpts, 'object', 'Option "testsDir" must be an object.' );
  multiTypeValidator( [ userOpts.path, userOpts.testsDir ], 'string', 'Option "path" or its alias "testsDir" must be a string.' );
  typeOrNilValidator( userOpts.beforeAll, 'string', 'Option "beforeAll" must be a string.' );
  typeOrNilValidator( userOpts.afterAll, 'string', 'Option "afterAll" must be a string.' );
  typeOrNilValidator( userOpts.retries, 'number', 'Option "retries" must be a string.' );
  typeOrNilValidator( userOpts.timeoutTime, 'number', 'Option "timeoutTime" must be a number.' );
  typeOrNilValidator( userOpts.eventTimeoutTime, 'number', 'Option "eventTimeoutTime" must be a number.' );
};
